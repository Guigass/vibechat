import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';
import { XmppService } from '../xmpp/xmpp.service';
import { UserPreferenceService } from '../user-preference/user-preference.service';
import { LoginModel } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private preferenceKey = 'uc';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private xmppService: XmppService, private userPreference: UserPreferenceService) {
    this.checkAutoLogin();
  }

  login(server: string, username: string, password: string, rememberMe: boolean, autoLogin: boolean): Observable<boolean> {
    if (rememberMe) {
      this.userPreference.setPreference(this.preferenceKey, { server, username, password, rememberMe, autoLogin });
    } else {
      this.userPreference.removePreference(this.preferenceKey);
    }

    return this.xmppService.connect(`wss://${server}:7443/ws`, server, `${username}@${server}`, password).pipe(
      switchMap(() => {
        this.isAuthenticatedSubject.next(true);
        return of(true);
      }),
      catchError(error => {
        console.error('Erro na conexão XMPP:', error);
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  private checkAutoLogin(): void {
    const userCredentials = this.userPreference.getPreference<LoginModel>(this.preferenceKey);
    if (userCredentials && userCredentials.autoLogin) {
      this.login(userCredentials.server, userCredentials.username, userCredentials.password, true, true).subscribe();
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
