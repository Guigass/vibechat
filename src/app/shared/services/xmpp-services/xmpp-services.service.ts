import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { xml } from '@xmpp/client';
import { ReplaySubject, filter, take, timer, map, from, catchError, of, retry } from 'rxjs';
import { XmppServicesModel } from '../../models/xmpp-services.model';

@Injectable({
  providedIn: 'root'
})
export class XmppServicesService {
  private xmppService = inject(XmppService);

  private servicesSource = new ReplaySubject<XmppServicesModel[]>(1);
  public services$ = this.servicesSource.asObservable();

  constructor() {
    if (this.xmppService.isConnected) {
      this.discoverServices();
    } else {
      this.xmppService.onOnline$.subscribe(() => {
        this.discoverServices();
      });
    }

    this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq') && stanza.getChild('query', 'http://jabber.org/protocol/disco#items')),
      take(1)
    ).subscribe(stanza => {
      const servicesDiscovered = stanza.getChild('query', 'http://jabber.org/protocol/disco#items').children;
      this.servicesSource.next(servicesDiscovered.map((service: any) => ({
        jid: service.attrs.jid,
        name: service.attrs.name
      })));
    });
  }

  private discoverServices() {
    const iq = xml('iq', { type: 'get', to: this.xmppService.domain, id: 'disco-items' },
      xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
    );

    return from(this.xmppService.sendStanza(iq)).pipe(
      catchError(error => {
        console.error('Falha ao descobrir serviços:', error);
        return of([]);
      }),
      retry(2)
    );
  }
}
