import { SurveyDraft, SyncStatus } from '../types/survey';

const DB_NAME = 'VKUSurveyDB';
const DB_VERSION = 1;
const STORE_SURVEYS = 'surveys';

export class IndexedDBService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_SURVEYS)) {
          const store = db.createObjectStore(STORE_SURVEYS, { keyPath: 'id' });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          console.log('[IndexedDB] Object store "surveys" initialized.');
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event: Event) => {
        console.error('[IndexedDB] Database error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Save or update a survey draft in IndexedDB
   */
  public async saveDraft(draft: SurveyDraft): Promise<SurveyDraft> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readwrite');
      const store = transaction.objectStore(STORE_SURVEYS);
      const request = store.put(draft);

      request.onsuccess = () => resolve(draft);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve a single survey draft by ID
   */
  public async getDraft(id: string): Promise<SurveyDraft | null> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readonly');
      const store = transaction.objectStore(STORE_SURVEYS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all survey drafts sorted by createdAt descending
   */
  public async getAllDrafts(): Promise<SurveyDraft[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readonly');
      const store = transaction.objectStore(STORE_SURVEYS);
      const index = store.index('createdAt');
      const request = index.openCursor(null, 'prev');
      const results: SurveyDraft[] = [];

      request.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending or failed drafts waiting to sync
   */
  public async getPendingDrafts(): Promise<SurveyDraft[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readonly');
      const store = transaction.objectStore(STORE_SURVEYS);
      const index = store.index('syncStatus');
      const request = index.getAll(IDBKeyRange.only('PENDING_SYNC'));

      request.onsuccess = () => {
        const pending = request.result || [];
        const reqFailed = store.index('syncStatus').getAll(IDBKeyRange.only('FAILED'));
        reqFailed.onsuccess = () => {
          const failed = reqFailed.result || [];
          resolve([...pending, ...failed]);
        };
        reqFailed.onerror = () => resolve(pending);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update sync status of a draft
   */
  public async updateSyncStatus(id: string, status: SyncStatus, errorMessage?: string): Promise<void> {
    const draft = await this.getDraft(id);
    if (!draft) return;

    draft.syncStatus = status;
    draft.updatedAt = Date.now();
    if (errorMessage) {
      draft.lastErrorMessage = errorMessage;
      draft.retryCount = (draft.retryCount || 0) + 1;
    }

    await this.saveDraft(draft);
  }

  /**
   * Delete a draft from IndexedDB
   */
  public async deleteDraft(id: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readwrite');
      const store = transaction.objectStore(STORE_SURVEYS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all stored drafts
   */
  public async clearAll(): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_SURVEYS], 'readwrite');
      const store = transaction.objectStore(STORE_SURVEYS);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new IndexedDBService();
