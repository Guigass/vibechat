import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client-core';
import { filter, Observable, map } from 'rxjs';
import { VCardModel } from '../../models/contact.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class VcardService {
  private xmppService = inject(XmppService);

  constructor() { }

  public requestVCard(jid: string): Observable<void> {
    return this.xmppService.sendStanza(xml('iq', { type: 'get', id: uuidv4(), to: jid }, xml('vCard', { xmlns: 'vcard-temp' })));
  }

  public getVCard(jid: string): Observable<VCardModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.attrs.type === 'result' && stanza.attrs.from === jid),
      map((stanza:any) => {
        return {
          jid: jid,
          fullname: stanza.getChild('vCard').getChild('FN').text(),
          nickname: stanza.getChild('vCard').getChild('NICKNAME').text(),
          email: stanza.getChild('vCard').getChild('EMAIL').getChild('USERID').text(),
          phone: stanza.getChild('vCard').getChild('TEL').getChild('NUMBER').text(),
          givenName: stanza.getChild('vCard').getChild('N').getChild('GIVEN').text(),
          familyName: stanza.getChild('vCard').getChild('N').getChild('FAMILY').text(),
          avatar: stanza.getChild('vCard').getChild('PHOTO').getChild('BINVAL').text()
        };
      })
    );
  }
}
