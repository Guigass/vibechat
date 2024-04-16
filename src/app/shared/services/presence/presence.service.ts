import { Observable, filter, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { PresenceType } from '../../enums/presence-type.enum';
import { PresenceModel } from '../../models/presence.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private xmppService = inject(XmppService);

  sendPresence(presenceType: PresenceType, statusMessage: string): Observable<void> {
    let presenceStanza = xml('presence', {},
      xml('show', {}, presenceType === PresenceType.Online ? '' : presenceType.toLowerCase()),
      xml('status', {}, presenceType === PresenceType.Online ? 'Online' : statusMessage)
    );

    return this.xmppService.sendStanza(presenceStanza);
  }

  getPresences(): Observable<PresenceModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('presence')),
      filter(stanza => stanza.attrs.from),
      map(stanza => {
        const jid = stanza.attrs.from.split('/')[0];
        const type = stanza.attrs.type;
        if (type ===  'unavailable') {
          return { type: PresenceType.Offline, jid: jid};
        }

        const status = stanza.getChild('status')?.getText();
        if (status?.toLowerCase() == 'online') {
          return { type: PresenceType.Online, jid: jid};
        }

        const presenceType = stanza.getChild('show');
        if (presenceType) {
          return { type: presenceType.getText() as PresenceType, jid: jid, status: status };
        } else {
          return { type: PresenceType.Offline, jid: jid, status: status };
        }
      })
    );
  }

  getPresenceFromUser(jid: string): Observable<PresenceModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('presence')),
      filter(stanza => stanza.attrs.from.split('/')[0] === jid),
      map(stanza => {
        const type = stanza.attrs.type;
        if (type ===  'unavailable') {
          return { type: PresenceType.Offline, jid: jid};
        }

        const status = stanza.getChild('status')?.getText();
        if (status.toLowerCase() == 'online') {
          return { type: PresenceType.Online, jid: jid};
        }

        const presenceType = stanza.getChild('show');
        if (presenceType) {
          return { type: presenceType.getText() as PresenceType, jid: jid, status: status };
        } else {
          return { type: PresenceType.Offline, jid: jid, status: status };
        }
      })
    );
  }
}
