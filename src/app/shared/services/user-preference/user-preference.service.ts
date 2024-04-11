import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  private localStorageService = inject(LocalStorageService);

  setPreference(key: string, value: any): void {
    this.localStorageService.setItem(`preferences_${key}`, value, true);
  }

  getPreference<T>(key: string): T | null {
    return this.localStorageService.getItem(`preferences_${key}`);
  }

  removePreference(key: string): void {
    this.localStorageService.removeItem(`preferences_${key}`);
  }

  clearPreferences(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith("preferences_")) {
        this.localStorageService.removeItem(key);
      }
    }
  }
}
