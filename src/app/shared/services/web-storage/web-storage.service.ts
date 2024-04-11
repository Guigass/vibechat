import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageType } from '../../enums/storage-type.enum';
import { EncryptService } from '../encrypt/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  private encryptService = inject(EncryptService);
  
  private prefix = 'e:';
  
  setItem(key: string, value: any, storageType: StorageType, encrypt = false): void {
    let storage = this.getStorage(storageType);
    
    let valueToStore = value;

    if (typeof value === 'object') {
      valueToStore = JSON.stringify(value);
    }

    if (encrypt) {
      valueToStore = this.prefix + this.encryptService.encrypt(valueToStore);
    }

    storage.setItem(key, valueToStore);
  }

  getItem<T>(key: string, storageType: StorageType): T | null {
    let storage = this.getStorage(storageType);
    const item = storage.getItem(key);

    if (!item) return null;

    let valueToReturn = item;
    if (item.startsWith(this.prefix)) {
      valueToReturn = item.slice(this.prefix.length);

      valueToReturn = this.encryptService.decrypt(valueToReturn);
    }

    try {
      return JSON.parse(valueToReturn) as T;
    } catch {
      return valueToReturn as T;
    }
  }

  removeItem(key: string, storageType: StorageType): void {
    let storage = this.getStorage(storageType);
    storage.removeItem(key);
  }

  clear(storageType: StorageType): void {
    let storage = this.getStorage(storageType);
    storage.clear();
  }

  private getStorage(storageType: StorageType): Storage {
    return storageType === StorageType.Local ? localStorage : sessionStorage;
  }
}
