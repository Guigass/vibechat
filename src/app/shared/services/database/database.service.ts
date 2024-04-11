import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, defer, filter, from, map, of, switchMap } from 'rxjs';
import { EncryptService } from '../encrypt/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storage =  inject(Storage);
  private encryptService =  inject(EncryptService);
  private storageReady = new BehaviorSubject<boolean>(false);

  private userPrefix = 'app';

  constructor() {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();

    this.storageReady.next(true);
  }

  setUserPrefix(userId?: string) {
    if (!userId) {
      this.userPrefix = 'app';
    }

    this.userPrefix = `user_${userId}:`;
  }

  private prefixKey(key: string): string {
    return `${this.userPrefix}${key}`;
  }

  addData(key: string, value: any): Observable<any> {
    value = this.encryptService.encrypt(value);
    
    return this.storageReady.pipe(
      filter(ready => ready === true),
      switchMap(() => from(this.storage.set(this.prefixKey(key), value))
    ));
  }

  getData(key: string): Observable<any> {
    console.log(key)
    return this.storageReady.pipe(
      filter((ready: boolean) => ready === true),
      switchMap(() => this.storage.get(this.prefixKey(key)) || of([])),
      map((value) => {
        console.log(value);
        if (!value) {
          return this.encryptService.decrypt(value);
        } else {
          return null;
        }
      })
    );
  }
}
