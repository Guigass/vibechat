import { Observable, filter, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { PresenceType } from '../../enums/presence-type.enum';
import { PresenceModel } from '../../models/presence.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  constructor(private xmppService: XmppService) { }

  sendPresence(presenceType: PresenceType, statusMessage: string): Observable<void> {
    let presenceStanza = xml('presence', {},
      xml('show', {}, presenceType === PresenceType.Online ? '' : presenceType.toLowerCase()),
      xml('status', {}, presenceType === PresenceType.Online ? 'Online' : statusMessage)
    );

    return this.xmppService.sendStanza(presenceStanza);
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
        if (status == 'Online') {
          return { type: PresenceType.Online, jid: jid};
        }

        const presenceType = stanza.getChild('show');
        if (presenceType) {
          return { type: presenceType.getText() as PresenceType, jid: jid, status: status };
        }

        return { type: presenceType, status: status, jid: jid};
      })
    );
  }
}
