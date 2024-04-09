import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { Observable, filter, map } from 'rxjs';
import { ContactGroupModel } from '../../models/contact-group.model';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  constructor(private xmppService: XmppService) { }

  requestRoster(): Observable<void> {
    return this.xmppService.sendStanza(xml('iq', { type: 'get' }, xml('query', { xmlns: 'jabber:iq:roster' })));
  }

  getRoster(): Observable<ContactGroupModel[]> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.getChild('query', 'jabber:iq:roster')),
      map(stanza => {
        const contacts = stanza.getChild('query').getChildren('item').map((item: any) => {
          const jid = item.attrs.jid;
          const name = item.attrs.name;
          const groups = item.getChildren('group').map((group: any) => group.text());
          return { jid, name, groups };
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
}
