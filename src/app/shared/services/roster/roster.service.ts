import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { Observable, filter, map } from 'rxjs';
import { ContactModel } from '../../models/contact.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private xmppService = inject(XmppService);

  requestRoster(): Observable<void> {
    return this.xmppService.sendStanza(xml('iq', { type: 'get', id: uuidv4() }, xml('query', { xmlns: 'jabber:iq:roster' })));
  }

  getRosterList(): Observable<ContactModel[]> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.attrs.type === 'result' && stanza.getChild('query', 'jabber:iq:roster')),
      map(stanza => {
        const contacts = stanza.getChild('query').getChildren('item').map((item: any) => {
          const jid = item.attrs.jid;
          let name = item.attrs.name;
          const subscription = item.attrs.subscription;
          const groups = item.getChildren('group').map((group: any) => group.text());

          if (!name) {
            name = jid.split('@')[0];
          }

          const contact = { jid, name, groups, subscription };

          return contact;
        });

        return contacts;
      })
    );
  }

  getRosterUpdate(): Observable<ContactModel> {
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
