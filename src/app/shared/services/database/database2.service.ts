import { Injectable, inject } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { VCardModel } from '../../models/vcard.model';
import { XmppService } from '../xmpp/xmpp.service';
import { encrypted, Encryption } from "@pvermeer/dexie-encrypted-addon";
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { dexieRxjs } from '@pvermeer/dexie-rxjs-addon';

@Injectable({
  providedIn: 'root'
})

export class Database2Service extends Dexie {
  contacts!: Table<ContactModel, number>;
  presences!: Table<PresenceModel, number>;
  contactsInfo!: Table<VCardModel, number>;

  private dbReady$ = new BehaviorSubject<boolean>(false);
  public dbReady = this.dbReady$.asObservable();

  constructor() {
    super(`vcd_${inject(XmppService).jid}`);

    encrypted(this, { secretKey: environment.storageEncryptionKey });
    dexieRxjs(this);

    this.version(1).stores({
      contacts: '++id, jid, $name, $groups, $subscription, $presence, $hidden, $isTyping, $userinfo',
      presences: '++id, jid, $type, $status',
      contactsInfo: '++id, jid, $fullname, $nickname, $email, $phone, $givenName, $familyName, $avatar'
    });

    this.open().then(() => {
      this.dbReady$.next(true);
    });
  }
}
