import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, catchError, of, switchMap } from 'rxjs';
import { XmppService } from '../xmpp/xmpp.service';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enun';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private xmppService = inject(XmppService);
  private localStorageService = inject(LocalStorageService);
  private sessionStorageService = inject(SessionStorageService);

  private preferenceKey = PreferencesKey.UserCredentials;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  login(userCredentials: LoginModel): Observable<boolean> {
    return this.xmppService.connect(`wss://${userCredentials.server}:7443/ws`, userCredentials.server, `${userCredentials.username}`, userCredentials.password).pipe(
      switchMap(() => {
        this.sessionStorageService.setItem(this.preferenceKey, userCredentials, true);

        if (userCredentials.rememberMe) {
          const credentialsToSave = userCredentials.autoLogin ? userCredentials : { ...userCredentials, password: '' };
          this.localStorageService.setItem(this.preferenceKey, credentialsToSave, true);
        } else {
          this.localStorageService.removeItem(this.preferenceKey);
        }
        
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
    const sessionUserCredentials = this.sessionStorageService.getItem<LoginModel>(this.preferenceKey);

    if (sessionUserCredentials) {
      return this.login(sessionUserCredentials);
    }

    const userCredentials = this.localStorageService.getItem<LoginModel>(this.preferenceKey);
    if (userCredentials && userCredentials.autoLogin) {
      return this.login(userCredentials);
    }

    return of(false);
  }

  logout(): void {
    this.xmppService.disconnect();
    this.sessionStorageService.removeItem(this.preferenceKey);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
