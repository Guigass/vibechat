import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { XmppService } from '../xmpp/xmpp.service';
import { VCardModel } from '../../models/vcard.model';
import { xml } from '@xmpp/client';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { VcardService } from '../vcard/vcard.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private vcardService = inject(VcardService);
  private authService = inject(AuthService);

  private userVcard!: BehaviorSubject<VCardModel>;
  public userVcard$ = this.userVcard.asObservable();

  constructor() { 
    this.vcardService.getVCard(this.authService.jid()).subscribe((vcard: VCardModel) => {
      this.userVcard.next(vcard);
    });
  }
}
