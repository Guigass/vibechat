import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, concatMap, defer, filter, from, map, of, switchMap, tap, zip } from 'rxjs';
import { EncryptService } from '../encrypt/encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storage =  inject(Storage);
  private encryptService =  inject(EncryptService);

  public storageReady = new BehaviorSubject<boolean>(false);

  private userPrefix = 'app';

  init(): Observable<boolean> {
    return from(this.storage.defineDriver(CordovaSQLiteDriver)).pipe(
      concatMap(() => from(this.storage.create())),
      tap(() => this.storageReady.next(true)),
      concatMap(() => this.storageReady.asObservable())
    );
  }

  setUserPrefix(userId?: string) {
    if (!userId) {
      this.userPrefix = 'app';
    }

    this.userPrefix = `_${userId}:`;
  }

  private prefixKey(key: string): string {
    return `${this.userPrefix}${key}`;
  }

  addData(key: string, value: any): Observable<any> {
    const enctyptedValue = this.encryptService.encrypt(value);

    return this.storageReady.pipe(
      filter(ready => ready === true),
      switchMap(() => from(this.storage.set(this.prefixKey(key), enctyptedValue))),
      map(() => value)
    );
  }

  getData(key: string): Observable<any> {
    if (key.startsWith(this.userPrefix)){
      key = key.replace(this.userPrefix, '');
    }

    return this.storageReady.pipe(
      filter((ready: boolean) => ready === true),
      switchMap(() => {
        return from(this.storage.get(this.prefixKey(key)));
      }),
      map((value) => {
        if (value) {
          return this.encryptService.decrypt(value);
        } else {
          return null;
        }
      })
    );
  }

  getAllDataKeys(prefix: string): Observable<string[]> {
    return this.storageReady.pipe(
      filter((ready: boolean) => ready === true),
      switchMap(() => {
        return from(this.storage.keys());
      }),
      map((keys: string[]) => {
        return keys.filter(key => key.startsWith(this.prefixKey(prefix)));
      }),
    );
  }

  getAllData(prefix: string): Observable<any[]> {
    return this.storageReady.pipe(
      filter((ready: boolean) => ready === true),
      switchMap(() => {
        return from(this.storage.keys());
      }),
      map((keys: string[]) => {
        return keys.filter(key => key.startsWith(this.prefixKey(prefix)));
      }),
      switchMap((keys: string[]) => {
        return zip(keys.map(key => this.getData(key)));
      })
    );
  }
}
