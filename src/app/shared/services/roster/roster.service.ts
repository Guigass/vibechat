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
    return this.xmppService.sendStanza(xml('iq', {type: 'get'}, xml('query', {xmlns: 'jabber:iq:roster'})));
  }

  getRoster(): Observable<ContactGroupModel[]> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.getChild('query', 'jabber:iq:roster')),
      map(stanza => {
        const contacts = stanza.getChild('query').getChildren('item').map((item: any) => {
          return {
            jid: item.attrs.jid,
            name: item.attrs.name,
            groups: item.getChildren('group').map((group: any) => group.text())
          }
        });

        const groupedContacts: ContactGroupModel[] = [];
        
        contacts.forEach((contact: any) => {
          contact.groups.forEach((group: any) => {
            const existingGroup = groupedContacts.find(g => g.name === group);
            if (existingGroup) {
              existingGroup.contacts.push(contact);
            } else {
              groupedContacts.push({
                name: group,
                contacts: [contact]
              });
            }
          });
        });

        return groupedContacts;
      })
    )
  }
}
