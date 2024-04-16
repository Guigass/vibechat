import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { VCardModel } from '../../models/vcard.model';

@Injectable({
  providedIn: 'root'
})

export class Database2Service extends Dexie {
  contacts!: Table<ContactModel, number>;
  presences!: Table<PresenceModel, number>;
  contactsInfo!: Table<VCardModel, number>;

  constructor() {
    super('vibe-chat-DB');

    this.version(1).stores({
      contacts: '++id, jid',
      presences: '++id, jid',
      contactsInfo: '++id, jid'
    });
  }
}
