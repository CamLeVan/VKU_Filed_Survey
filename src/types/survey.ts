export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  timestamp: number;
}

export type InspectionCategory = 'Hardware' | 'Projector' | 'AC' | 'Electrical' | 'Furniture';
export type SyncStatus = 'PENDING_SYNC' | 'SYNCED' | 'FAILED';

export interface SurveyDraft {
  id: string; // UUID string
  building: string; // e.g. "Building A", "Building V"
  floor: string; // e.g. "Floor 4"
  roomNumber: string; // e.g. "Room 402"
  inspectorName: string;
  category: InspectionCategory;
  conditionRating: number; // 1 to 5 Stars
  defectNotes: string;
  location?: GeoLocationData | null;
  photoBase64?: string | null;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  retryCount: number;
  lastErrorMessage?: string;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{ id: string; message: string }>;
}

export interface NativePhotoResult {
  base64Data: string;
  format: string;
  webPath?: string;
}
