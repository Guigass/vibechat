import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { XmppService } from '../xmpp/xmpp.service';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enum';
import { WebStorageService } from '../web-storage/web-storage.service';
import { StorageType } from '../../enums/storage-type.enum';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private xmppService = inject(XmppService);
  private webStorageService = inject(WebStorageService);

  private preferenceKey = PreferencesKey.UserCredentials;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public jid = signal('');

  constructor() {}

  login(userCredentials: LoginModel): Observable<boolean> {
    return this.xmppService.connect(`wss://${userCredentials.server}:5443/ws`, userCredentials.server, `${userCredentials.username}`, userCredentials.password).pipe(
      switchMap((logged) => {
        this.webStorageService.setItem(this.preferenceKey, userCredentials, StorageType.Session, true);

        if (userCredentials.rememberMe) {
          const credentialsToSave = userCredentials.autoLogin ? userCredentials : { ...userCredentials, password: '' };
          this.webStorageService.setItem(this.preferenceKey, credentialsToSave, StorageType.Local, true);
        } else {
          this.webStorageService.removeItem(this.preferenceKey, StorageType.Local);
        }
        
        this.jid.set(`${logged.local}@${logged.domain}`);
        this.isAuthenticatedSubject.next(true);
        return of(true);
      }),
      catchError(error => {
        this.xmppService.disconnect();
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  public checkAutoLogin(): Observable<boolean> {
    const sessionUserCredentials = this.webStorageService.getItem<LoginModel>(this.preferenceKey, StorageType.Session);

    if (sessionUserCredentials) {
      return this.login(sessionUserCredentials);
    }

    const userCredentials = this.webStorageService.getItem<LoginModel>(this.preferenceKey, StorageType.Local);
    if (userCredentials && userCredentials.autoLogin) {
      return this.login(userCredentials);
    }

    return of(false);
  }

  logout(): void {
    this.xmppService.disconnect();
    this.webStorageService.removeItem(this.preferenceKey, StorageType.Session);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
