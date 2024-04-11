import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  private secretKey = environment.storageEncryptionKey;
  
  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(value: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  }
}
