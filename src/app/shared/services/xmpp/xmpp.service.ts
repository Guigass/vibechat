import { Injectable } from '@angular/core';
import { Client, client, xml } from '@xmpp/client';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmppService {

  private xmpp!: Client;

  public onStanza = new BehaviorSubject<any>(null);
  public onOnline = new BehaviorSubject<any>(null);
  public onOffline = new BehaviorSubject<any>(null);
  public onError = new BehaviorSubject<any>(null);

  public isConnected = false;

  constructor() {
  }

  connect(service: string, domain: string, username: string, password: string) {
    this.xmpp = client({
      service: service,
      domain: domain,
      username: username,
      password: password,
      resource: 'vibe-chat',
    });

    this.xmpp.on('online', (address) => {
      this.isConnected = true;
      this.xmpp.send(xml("presence"));
      this.onOnline.next(address);
    });

    this.xmpp.on('offline', () => {
      this.isConnected = false;

      this.onOffline.next(null);
    });

    this.xmpp.on('stanza', (stanza) => {
      this.onStanza.next(stanza);
    });

    this.xmpp.on('error', (err) => {
      this.onError.next(err);
    });

    return from(this.xmpp.start());
  }

  disconnect() {
    return from(this.xmpp.stop());
  }

  sendStanza(stanza: any) {
    if (!this.isConnected) {
      return from(Promise.reject('Not connected'));
    }

    return from(this.xmpp.send(stanza));
  }
}
