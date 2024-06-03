import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { XmppService } from '../xmpp/xmpp.service';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enum';
import { WebStorageService } from '../web-storage/web-storage.service';
import { StorageType } from '../../enums/storage-type.enum';
import { VCardModel } from '../../models/vcard.model';
import { xml } from '@xmpp/client-core';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private xmppService = inject(XmppService);
  private webStorageService = inject(WebStorageService);

  private preferenceKey = PreferencesKey.UserCredentials;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public jid = signal('');

  private userInfo: BehaviorSubject<VCardModel> = new BehaviorSubject<VCardModel>({ jid: '', fullname: '', nickname: '', email: '', phone: '', givenName: '', familyName: '', avatar: '', updatedAt: new Date() });
  public userInfo$ = this.userInfo.asObservable();

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

        this.initializeUserInfo();

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

  private initializeUserInfo(): void {
    this.xmppService.sendIq(xml('iq', { type: 'get', id: uuidv4(), to: this.jid() }, xml('vCard', { xmlns: 'vcard-temp' }))).subscribe((stanza: any) => {
      var ui = {
        jid: this.jid(),
        fullname: stanza.getChild('vCard')?.getChild('FN')?.text(),
        nickname: stanza.getChild('vCard')?.getChild('NICKNAME')?.text(),
        email: stanza.getChild('vCard')?.getChild('EMAIL')?.getChild('USERID')?.text(),
        phone: stanza.getChild('vCard')?.getChild('TEL')?.getChild('NUMBER')?.text(),
        givenName: stanza.getChild('vCard')?.getChild('N')?.getChild('GIVEN')?.text(),
        familyName: stanza.getChild('vCard')?.getChild('N')?.getChild('FAMILY')?.text(),
        avatar: stanza.getChild('vCard')?.getChild('PHOTO')?.getChild('BINVAL')?.text(),
        updatedAt: new Date()
      };

      this.userInfo.next(ui);
    });
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
