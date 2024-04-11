import { Injectable, inject } from '@angular/core';
import { WebStorageService } from '../web-storage/web-storage.service';
import { StorageType } from '../../enums/storage-type.enum';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  private webStorageService = inject(WebStorageService);

  setPreference(key: string, value: any): void {
    this.webStorageService.setItem(`preferences_${key}`, value, StorageType.Local, true);
  }

  getPreference<T>(key: string): T | null {
    return this.webStorageService.getItem(`preferences_${key}`, StorageType.Local);
  }

  removePreference(key: string): void {
    this.webStorageService.removeItem(`preferences_${key}`, StorageType.Local);
  }

  clearPreferences(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith("preferences_")) {
        this.webStorageService.removeItem(key, StorageType.Local);
      }
    }
  }
}
