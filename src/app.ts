import { dbService } from './services/db';
import { nativeService } from './services/nativeService';
import { syncManager } from './services/syncManager';
import { GeoLocationData, InspectionCategory, SurveyDraft } from './types/survey';

export class App {
  private currentLocation: GeoLocationData | null = null;
  private currentPhotoBase64: string | null = null;

  constructor() {
    this.initUI();
    this.bindEvents();
    this.listenSyncStatus();
    this.renderDraftsList();
  }

  private initUI(): void {
    // Set initial network badge status
    const isOnline = syncManager.getOnlineStatus();
    this.updateNetworkBadge(isOnline);

    // Bind native network listener
    nativeService.addNetworkListener((status) => {
      this.updateNetworkBadge(status.connected);
    });
  }

  private bindEvents(): void {
    // Form submit event
    const form = document.getElementById('survey-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Location button event
    const btnLocation = document.getElementById('btn-get-location');
    if (btnLocation) {
      btnLocation.addEventListener('click', () => this.handleGetLocation());
    }

    // Photo button event
    const btnPhoto = document.getElementById('btn-take-photo');
    if (btnPhoto) {
      btnPhoto.addEventListener('click', () => this.handleTakePhoto());
    }

    // Manual sync button event
    const btnSync = document.getElementById('btn-sync-now');
    if (btnSync) {
      btnSync.addEventListener('click', () => this.handleManualSync());
    }
  }

  private listenSyncStatus(): void {
    syncManager.onSyncStatusChange((isSyncing, result) => {
      const btnSync = document.getElementById('btn-sync-now') as HTMLButtonElement;
      if (btnSync) {
        if (isSyncing) {
          btnSync.disabled = true;
          btnSync.innerHTML = `<span class="status-dot"></span> Đang Đồng Bộ...`;
        } else {
          btnSync.disabled = false;
          btnSync.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Đồng Bộ Ngay (Sync Queue)`;
        }
      }

      if (result) {
        console.log('[App] Sync completed:', result);
        this.renderDraftsList();
      }
    });
  }

  private updateNetworkBadge(isOnline: boolean): void {
    const badge = document.getElementById('network-badge');
    const text = document.getElementById('network-status-text');
    if (badge && text) {
      if (isOnline) {
        badge.className = 'badge online';
        text.textContent = 'Online';
      } else {
        badge.className = 'badge offline';
        text.textContent = 'Offline (IndexedDB Draft Mode)';
      }
    }
  }

  private async handleGetLocation(): Promise<void> {
    const display = document.getElementById('location-display');
    if (display) {
      display.textContent = 'Đang lấy tọa độ vị trí GPS từ thiết bị...';
    }

    try {
      const pos = await nativeService.getCurrentPosition();
      this.currentLocation = pos;
      if (display) {
        display.className = 'location-display active';
        display.innerHTML = `
          <strong>GPS Captured:</strong> Lat: ${pos.latitude.toFixed(6)}, Lng: ${pos.longitude.toFixed(6)}
          <br/><small>(Độ chính xác: ~${Math.round(pos.accuracy)}m | Timestamp: ${new Date(pos.timestamp).toLocaleTimeString()})</small>
        `;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lấy GPS';
      if (display) {
        display.className = 'location-display empty';
        display.textContent = `Lỗi GPS: ${msg}`;
      }
    }
  }

  private async handleTakePhoto(): Promise<void> {
    const container = document.getElementById('photo-preview-container');
    if (container) {
      container.textContent = 'Mở camera / chọn hình ảnh...';
    }

    try {
      const photoResult = await nativeService.capturePhoto();
      this.currentPhotoBase64 = photoResult.base64Data;
      if (container) {
        container.className = 'photo-preview-container';
        container.innerHTML = `<img src="${photoResult.base64Data}" alt="Hình ảnh kiểm tra hiện trường" />`;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chụp ảnh thất bại';
      if (container) {
        container.className = 'photo-preview-container empty';
        container.textContent = `Thất bại: ${msg}`;
      }
    }
  }

  private async handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const building = (document.getElementById('building') as HTMLSelectElement).value;
    const floor = (document.getElementById('floor') as HTMLSelectElement).value;
    const roomNumber = (document.getElementById('roomNumber') as HTMLInputElement).value.trim();
    const inspectorName = (document.getElementById('inspectorName') as HTMLInputElement).value.trim();
    const category = (document.getElementById('category') as HTMLSelectElement).value as InspectionCategory;
    const ratingRadio = document.querySelector('input[name="conditionRating"]:checked') as HTMLInputElement;
    const conditionRating = ratingRadio ? parseInt(ratingRadio.value, 10) : 5;
    const defectNotes = (document.getElementById('defectNotes') as HTMLTextAreaElement).value.trim();

    if (!roomNumber || !inspectorName) {
      alert('Vui lòng nhập đầy đủ Số Phòng và Tên Người Kiểm Tra.');
      return;
    }

    const uuid = 'vku_uuid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const newDraft: SurveyDraft = {
      id: uuid,
      building,
      floor,
      roomNumber,
      inspectorName,
      category,
      conditionRating,
      defectNotes,
      location: this.currentLocation,
      photoBase64: this.currentPhotoBase64,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: 'PENDING_SYNC',
      retryCount: 0
    };

    try {
      await dbService.saveDraft(newDraft);
      console.log('[App] Saved survey draft into IndexedDB:', newDraft.id);

      // Reset Form State
      (document.getElementById('survey-form') as HTMLFormElement).reset();
      this.currentLocation = null;
      this.currentPhotoBase64 = null;

      const locDisplay = document.getElementById('location-display');
      if (locDisplay) {
        locDisplay.className = 'location-display empty';
        locDisplay.textContent = 'Chưa ghi nhận GPS. Nhấn nút để lấy tọa độ thiết bị.';
      }

      const photoContainer = document.getElementById('photo-preview-container');
      if (photoContainer) {
        photoContainer.className = 'photo-preview-container empty';
        photoContainer.textContent = 'Chưa có hình ảnh.';
      }

      // Refresh UI list
      await this.renderDraftsList();

      // Trigger automatic sync if device is online
      if (syncManager.getOnlineStatus()) {
        syncManager.syncPendingDrafts();
      }
    } catch (err) {
      console.error('[App] Save draft failed:', err);
      alert('Không thể lưu bản nháp vào IndexedDB.');
    }
  }

  private async handleManualSync(): Promise<void> {
    await syncManager.syncPendingDrafts();
    await this.renderDraftsList();
  }

  public async renderDraftsList(): Promise<void> {
    const container = document.getElementById('drafts-list');
    if (!container) return;

    try {
      const drafts = await dbService.getAllDrafts();
      if (drafts.length === 0) {
        container.innerHTML = `<div class="location-display empty" style="text-align: center;">Chưa có bản nháp khảo sát nào được lưu trong IndexedDB.</div>`;
        return;
      }

      container.innerHTML = drafts.map((draft) => this.createDraftCardHTML(draft)).join('');

      // Event listeners for action buttons
      drafts.forEach((draft) => {
        const deleteBtn = document.getElementById(`btn-del-${draft.id}`);
        if (deleteBtn) {
          deleteBtn.addEventListener('click', async () => {
            if (confirm(`Bạn có chắc muốn xóa bản nháp "${draft.roomNumber} - ${draft.building}"?`)) {
              await dbService.deleteDraft(draft.id);
              await this.renderDraftsList();
            }
          });
        }

        const retryBtn = document.getElementById(`btn-retry-${draft.id}`);
        if (retryBtn) {
          retryBtn.addEventListener('click', async () => {
            await dbService.updateSyncStatus(draft.id, 'PENDING_SYNC');
            await syncManager.syncPendingDrafts();
            await this.renderDraftsList();
          });
        }
      });
    } catch (err) {
      console.error('[App] Failed to render drafts:', err);
      container.innerHTML = `<div class="location-display empty">Lỗi đọc dữ liệu IndexedDB.</div>`;
    }
  }

  private createDraftCardHTML(draft: SurveyDraft): string {
    const formattedDate = new Date(draft.createdAt).toLocaleString('vi-VN');
    const stars = '★'.repeat(draft.conditionRating) + '☆'.repeat(5 - draft.conditionRating);
    const locationText = draft.location
      ? `Lat: ${draft.location.latitude.toFixed(5)}, Lng: ${draft.location.longitude.toFixed(5)}`
      : 'Không có dữ liệu GPS';

    return `
      <div class="draft-item" id="card-${draft.id}">
        <div class="draft-header-row">
          <span class="draft-title">${this.escapeHTML(draft.building)} - ${this.escapeHTML(draft.floor)} - ${this.escapeHTML(draft.roomNumber)}</span>
          <span class="status-pill ${draft.syncStatus}">${draft.syncStatus}</span>
        </div>

        <div class="draft-details">
          <div><strong>Người kiểm tra:</strong> ${this.escapeHTML(draft.inspectorName)}</div>
          <div><strong>Hạng mục:</strong> ${draft.category}</div>
          <div><strong>Đánh giá:</strong> <span style="color: #f59e0b;">${stars}</span> (${draft.conditionRating}/5)</div>
          <div><strong>Thời gian:</strong> ${formattedDate}</div>
          <div><strong>Vị trí:</strong> ${locationText}</div>
        </div>

        ${draft.defectNotes ? `<div><strong>Mô tả hư hỏng:</strong> ${this.escapeHTML(draft.defectNotes)}</div>` : ''}

        ${draft.photoBase64 ? `
          <div class="draft-photo-thumb">
            <img src="${draft.photoBase64}" alt="Ảnh khảo sát" />
          </div>
        ` : ''}

        ${draft.lastErrorMessage ? `<div style="color: #f87171; font-size: 0.8rem;">Lỗi đồng bộ: ${this.escapeHTML(draft.lastErrorMessage)}</div>` : ''}

        <div class="draft-footer-row">
          <span style="font-size: 0.75rem; color: #94a3b8;">UUID: ${draft.id}</span>
          <div style="display: flex; gap: 8px;">
            ${draft.syncStatus === 'FAILED' ? `
              <button id="btn-retry-${draft.id}" class="btn btn-secondary btn-sm">Thử Lại</button>
            ` : ''}
            <button id="btn-del-${draft.id}" class="btn btn-danger btn-sm">Xóa</button>
          </div>
        </div>
      </div>
    `;
  }

  private escapeHTML(str: string): string {
    return str.replace(/[&<>'"]/g, 
      (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }
}
