import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private secretKey = environment.storageEncryptionKey;
  private prefix = 'e:';

  setItem(key: string, value: any, encrypt = false): void {
    let valueToStore = value;

    if (typeof value === 'object') {
      valueToStore = JSON.stringify(value);
    }

    if (encrypt) {
      valueToStore = this.prefix + CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
    }

    localStorage.setItem(key, valueToStore);
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    let valueToReturn = item;
    if (item.startsWith(this.prefix)) {
      valueToReturn = item.slice(this.prefix.length);

      const decryptedBytes = CryptoJS.AES.decrypt(valueToReturn, this.secretKey);
      valueToReturn = decryptedBytes.toString(CryptoJS.enc.Utf8);
    }

    try {
      return JSON.parse(valueToReturn) as T;
    } catch {
      return valueToReturn as T;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
