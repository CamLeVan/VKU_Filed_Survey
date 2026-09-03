import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Network, ConnectionStatus } from '@capacitor/network';
import { GeoLocationData, NativePhotoResult } from '../types/survey';

export class NativeService {
  public isNative: boolean = Capacitor.isNativePlatform();

  constructor() {
    console.log(`[NativeService] Platform: ${this.isNative ? 'Capacitor Native Android/iOS' : 'PWA Web Browser'}`);
  }

  /**
   * Monitor Network status natively via @capacitor/network with Web API fallback
   */
  public async addNetworkListener(callback: (status: ConnectionStatus) => void): Promise<void> {
    if (this.isNative) {
      await Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        console.log('[NativeService] Capacitor Network status change:', status);
        callback(status);
      });
      const initial = await Network.getStatus();
      callback(initial);
    } else {
      window.addEventListener('online', () => callback({ connected: true, connectionType: 'wifi' }));
      window.addEventListener('offline', () => callback({ connected: false, connectionType: 'none' }));
      callback({ connected: navigator.onLine, connectionType: 'wifi' });
    }
  }

  /**
   * Capture survey photo using Capacitor Camera plugin or Web HTML5 file input fallback
   */
  public async capturePhoto(): Promise<NativePhotoResult> {
    if (this.isNative) {
      try {
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera
        });

        if (!photo.base64String) {
          throw new Error('No photo data returned from Capacitor Camera');
        }

        return {
          base64Data: `data:image/${photo.format};base64,${photo.base64String}`,
          format: photo.format,
          webPath: photo.webPath
        };
      } catch (err: unknown) {
        console.warn('[NativeService] Capacitor Camera error, attempting fallback:', err);
        return this.triggerWebPhotoInput();
      }
    } else {
      return this.triggerWebPhotoInput();
    }
  }

  /**
   * Web fallback using HTML5 File API for capturing photo
   */
  private triggerWebPhotoInput(): Promise<NativePhotoResult> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Hint for mobile browser back camera

      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No image selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const resultStr = reader.result as string;
          resolve({
            base64Data: resultStr,
            format: file.type.split('/')[1] || 'jpeg'
          });
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }

  /**
   * Get current GPS location using Capacitor Geolocation plugin or Web Geolocation API fallback
   */
  public async getCurrentPosition(): Promise<GeoLocationData> {
    if (this.isNative) {
      try {
        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
          await Geolocation.requestPermissions();
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        return {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          timestamp: pos.timestamp
        };
      } catch (err) {
        console.warn('[NativeService] Capacitor Geolocation error, attempting Web fallback:', err);
        return this.getCurrentPositionWebFallback();
      }
    } else {
      return this.getCurrentPositionWebFallback();
    }
  }

  /**
   * Web fallback for Geolocation
   */
  private getCurrentPositionWebFallback(): Promise<GeoLocationData> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            timestamp: pos.timestamp
          });
        },
        (err) => {
          reject(new Error(`Geolocation error (${err.code}): ${err.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}

export const nativeService = new NativeService();
