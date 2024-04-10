import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  private storageService = inject(StorageService);

  setPreference(key: string, value: any): void {
    this.storageService.setItem(`preferences_${key}`, value, true);
  }

  getPreference<T>(key: string): T | null {
    return this.storageService.getItem(`preferences_${key}`);
  }

  removePreference(key: string): void {
    this.storageService.removeItem(`preferences_${key}`);
  }

  clearPreferences(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith("preferences_")) {
        localStorage.removeItem(key);
      }
    }
  }
}
