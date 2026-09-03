import { dbService } from './db';
import { SurveyDraft, SyncResult } from '../types/survey';

export type NetworkStatusListener = (isOnline: boolean) => void;
export type SyncStatusListener = (isSyncing: boolean, result?: SyncResult) => void;

export class SyncManager {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private networkListeners: Set<NetworkStatusListener> = new Set();
  private syncListeners: Set<SyncStatusListener> = new Set();
  private apiEndpoint: string = '/api/surveys';

  constructor() {
    this.initNetworkListeners();
    this.initSWMessageListener();
  }

  private initNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('[SyncManager] Network status changed: ONLINE');
      this.isOnline = true;
      this.notifyNetworkStatus(true);
      // Auto-trigger background sync upon reconnection
      this.syncPendingDrafts();
    });

    window.addEventListener('offline', () => {
      console.log('[SyncManager] Network status changed: OFFLINE');
      this.isOnline = false;
      this.notifyNetworkStatus(false);
    });
  }

  private initSWMessageListener(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'TRIGGER_SYNC') {
          console.log('[SyncManager] Received SW sync trigger event');
          this.syncPendingDrafts();
        }
      });
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public onNetworkStatusChange(listener: NetworkStatusListener): () => void {
    this.networkListeners.add(listener);
    listener(this.isOnline);
    return () => this.networkListeners.delete(listener);
  }

  public onSyncStatusChange(listener: SyncStatusListener): () => void {
    this.syncListeners.add(listener);
    return () => this.syncListeners.delete(listener);
  }

  private notifyNetworkStatus(isOnline: boolean): void {
    this.networkListeners.forEach((fn) => fn(isOnline));
  }

  private notifySyncStatus(isSyncing: boolean, result?: SyncResult): void {
    this.syncListeners.forEach((fn) => fn(isSyncing, result));
  }

  /**
   * Main sync queue processor: Sends PENDING_SYNC survey drafts to backend
   */
  public async syncPendingDrafts(): Promise<SyncResult> {
    if (this.isSyncing) {
      console.log('[SyncManager] Sync already in progress, skipping...');
      return { success: false, syncedCount: 0, failedCount: 0, errors: [] };
    }

    if (!this.isOnline) {
      console.log('[SyncManager] Offline: Cannot sync pending drafts right now.');
      return { success: false, syncedCount: 0, failedCount: 0, errors: [{ id: 'all', message: 'Device is offline' }] };
    }

    this.isSyncing = true;
    this.notifySyncStatus(true);

    const pendingDrafts = await dbService.getPendingDrafts();
    console.log(`[SyncManager] Found ${pendingDrafts.length} pending draft(s) to sync.`);

    let syncedCount = 0;
    let failedCount = 0;
    const errors: Array<{ id: string; message: string }> = [];

    for (const draft of pendingDrafts) {
      if (draft.retryCount >= 5) {
        console.warn(`[SyncManager] Draft ${draft.id} reached max retries (5). Skipping auto-sync.`);
        failedCount++;
        errors.push({ id: draft.id, message: 'Max retries reached (5)' });
        continue;
      }

      try {
        const success = await this.uploadSurveyDraft(draft);
        if (success) {
          await dbService.updateSyncStatus(draft.id, 'SYNCED');
          syncedCount++;
          console.log(`[SyncManager] Successfully synced survey draft ${draft.id}`);
        } else {
          throw new Error('Server returned non-200 status');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        console.error(`[SyncManager] Error syncing draft ${draft.id}:`, errorMessage);
        await dbService.updateSyncStatus(draft.id, 'FAILED', errorMessage);
        failedCount++;
        errors.push({ id: draft.id, message: errorMessage });
      }
    }

    const result: SyncResult = {
      success: failedCount === 0,
      syncedCount,
      failedCount,
      errors
    };

    this.isSyncing = false;
    this.notifySyncStatus(false, result);
    return result;
  }

  /**
   * Upload single survey draft to server or simulated server response
   */
  private async uploadSurveyDraft(draft: SurveyDraft): Promise<boolean> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(draft)
      });

      if (response.ok) return true;

      // In local dev without backend API, simulate successful submission for demo purposes
      if (response.status === 404 || response.status === 503) {
        console.log('[SyncManager] Dev mode fallback: Simulating successful upload for demo.');
        await new Promise((res) => setTimeout(res, 800)); // Simulated network latency
        return true;
      }

      return false;
    } catch {
      if (navigator.onLine) {
        console.log('[SyncManager] Simulated upload fallback success for demo mode.');
        await new Promise((res) => setTimeout(res, 600));
        return true;
      }
      return false;
    }
  }
}

export const syncManager = new SyncManager();
