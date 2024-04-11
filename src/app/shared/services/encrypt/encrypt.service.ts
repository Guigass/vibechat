import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  private secretKey = environment.storageEncryptionKey;
  
  constructor() { }

  encrypt(value: any): string {
    let valueToEncrypt = value;

    if (typeof value === 'object') {
      valueToEncrypt = JSON.stringify(value);
    }

    return CryptoJS.AES.encrypt(valueToEncrypt, this.secretKey).toString();
  }

  decrypt(value: any): any {
    const decryptedBytes = CryptoJS.AES.decrypt(value, this.secretKey);
    let decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(decryptedValue);
    } catch {
      return decryptedValue;
    }
  }
}
