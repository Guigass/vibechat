import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { Observable, filter, map, Subscription } from 'rxjs';
import { ContactGroupModel } from '../../models/contact-group.model';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { PresenceType } from '../../enums/presence-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private xmppService = inject(XmppService);

  requestRoster(): Observable<void> {
    const id = uuidv4();

    return this.xmppService.sendStanza(xml('iq', { type: 'get', id: uuidv4() }, xml('query', { xmlns: 'jabber:iq:roster' })));
  }

  getRosterList(): Observable<ContactGroupModel[]> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.attrs.type === 'result' && stanza.getChild('query', 'jabber:iq:roster')),
      map(stanza => {
        const contacts = stanza.getChild('query').getChildren('item').map((item: any) => {
          const jid = item.attrs.jid;
          let name = item.attrs.name;
          const subscription = item.attrs.subscription;
          const groups = item.getChildren('group').map((group: any) => group.text());
          const presence = { type: PresenceType.Offline, status: '', jid: jid } as PresenceModel;

          if (!name) {
            name = jid.split('@')[0];
          }

          return { jid, name, groups, subscription, presence };
        });

        const groupsMap = new Map<string, ContactGroupModel>();

        contacts.forEach((contact: any) => {
          contact.groups.forEach((group: any) => {
            if (!groupsMap.has(group)) {
              groupsMap.set(group, { name: group, contacts: [] });
            }
            const groupModel = groupsMap.get(group);
            if (groupModel) {
              groupModel.contacts.push(contact);
            }
          });
        });

        const groupedContacts: ContactGroupModel[] = Array.from(groupsMap.values());

        return groupedContacts;
      })
    );
  }

  getTosterUpdate(): Observable<ContactModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.attrs.type === 'set' && stanza.getChild('query', 'jabber:iq:roster')),
      map(stanza => {
        const item = stanza.getChild('query').getChild('item');
        const jid = item.attrs.jid as string;
        const name = item.attrs.name as string;
        const subscription = item.attrs.subscription as string;
        const groups = item.getChildren('group').map((group: any) => group.text()) as string[];

        return { jid, name, groups, subscription };
      })
    );
  }
}
