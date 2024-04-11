import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storage =  inject(Storage);

  private _storage: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    storage.setEncryptionKey(environment.storageEncryptionKey);

    this._storage = storage;
  }

  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  async keys(): Promise<string[]> {
    return await this._storage?.keys();
  }

  async length(): Promise<number> {
    const keys = await this._storage?.keys();
    return keys?.length ?? 0;
  }

  async forEach(callback: (key: string, value: any, index: number) => void): Promise<void> {
    const keys = await this._storage?.keys();
    for (let i = 0; i < (keys?.length ?? 0); i++) {
      const key = keys![i];
      const value = await this._storage?.get(key);
      callback(key, value, i);
    }
  }
}
