import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';
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
    return this.xmppService.connect(`wss://${userCredentials.server}:7443/ws`, userCredentials.server, `${userCredentials.username}`, userCredentials.password).pipe(
      switchMap(() => {
        this.isAuthenticatedSubject.next(true);

        if (userCredentials.rememberMe) {
          const credentialsToSave = userCredentials.autoLogin ? userCredentials : { ...userCredentials, password: '' };
          this.userPreference.setPreference(this.preferenceKey, credentialsToSave);
        } else {
          this.userPreference.removePreference(this.preferenceKey);
        }
        
        return of(true);
      }),
      catchError(error => {
        this.xmppService.disconnect();
        this.isAuthenticatedSubject.next(false);
        return of(false);
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
