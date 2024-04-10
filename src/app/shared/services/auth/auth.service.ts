import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap, map, tap } from 'rxjs';
import { XmppService } from '../xmpp/xmpp.service';
import { UserPreferenceService } from '../user-preference/user-preference.service';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enun';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private xmppService = inject(XmppService);
  private userPreference = inject(UserPreferenceService);

  private preferenceKey = PreferencesKey.UserCredentials;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkAutoLogin();
  }

  login(userCredentials: LoginModel): Observable<boolean> {
    return this.xmppService
      .connect(`wss://${userCredentials.server}:7443/ws`, userCredentials.server, `${userCredentials.username}@${userCredentials.server}`, userCredentials.password).pipe(
        switchMap(() => {
          if (userCredentials.rememberMe && userCredentials.autoLogin) {
            this.userPreference.setPreference(this.preferenceKey, userCredentials);
          } else if (userCredentials.rememberMe) {
            userCredentials.password = '';
            this.userPreference.setPreference(this.preferenceKey, userCredentials);
          } else {
            this.userPreference.removePreference(this.preferenceKey);
          }

          return this.xmppService.onOnline$.pipe(
            tap(() => this.isAuthenticatedSubject.next(true)),
            map(() => true)
          );
        }),
        catchError(error => {
          this.xmppService.disconnect();
          return this.xmppService.onOffline$.pipe(
            tap(() => this.isAuthenticatedSubject.next(false)),
            map(() => false)
          );
        })
      );
  }

  private checkAutoLogin(): void {
    const userCredentials = this.userPreference.getPreference<LoginModel>(this.preferenceKey);
    if (userCredentials && userCredentials.autoLogin) {
      this.login(userCredentials).subscribe();
    }
  }

  logout(): void {
    this.xmppService.disconnect();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
