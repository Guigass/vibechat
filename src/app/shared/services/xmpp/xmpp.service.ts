import { Injectable } from '@angular/core';
import { Client, client, xml } from '@xmpp/client';
import { BehaviorSubject, ReplaySubject, Subject, defer, filter, from, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmppService {
  public domain!: string;
  private xmpp!: Client;

  private onStanza = new ReplaySubject<any>();
  get onStanza$() {
    return this.onStanza.asObservable();
  }
  private onOnline = new Subject<any>();
  get onOnline$() {
    return this.onOnline.asObservable();
  }
  private onOffline = new Subject<any>();
  get onOffline$() {
    return this.onOffline.asObservable();
  }
  private onError = new Subject<any>();
  get onError$() {
    return this.onError.asObservable();
  }

  public isConnected = false;

  connect(service: string, domain: string, username: string, password: string) {
    if (this.xmpp && this.xmpp.status !== 'offline') {
      return of();
    }

    this.domain = domain;

    const loginParams = {
      service: service,
      domain: domain,
      username: username,
      password: password,
      resource: 'vibe-chat'
    };

    this.xmpp = client(loginParams);

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
      if (stanza) {
        this.onStanza.next(stanza);
      }
    });

    this.xmpp.on('error', (err) => {
      this.onError.next(err);
    });

    return defer(() => from(this.xmpp.start()));
  }

  disconnect() {
    return defer(() => from(this.xmpp.stop()));
  }

  sendStanza(stanza: any) {
    if (!this.isConnected) {
      return defer(() => from(Promise.reject('Not connected')));
    }

    return defer(() => from(this.xmpp.send(stanza)));
  }

  sendIq(stanza: any) {
    if (!this.isConnected) {
      return from(Promise.reject('Not connected'));
    }

    return defer(() => from(this.xmpp.iqCaller.request(stanza)));
  }
}
