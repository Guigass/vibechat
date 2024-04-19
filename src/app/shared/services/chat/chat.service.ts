import { xml } from '@xmpp/client';
import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { v4 as uuidv4 } from 'uuid';
import { Observable, catchError, defer, distinctUntilChanged, filter, map, max, of, share, startWith, switchMap, takeUntil, tap, throwError, timer } from 'rxjs';
import { MessageModel } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private xmppService = inject(XmppService);

  sendMessage(body: string, to: string): Observable<MessageModel> {
    const id = uuidv4();

    var message =
      xml('message', { to: to, type: 'chat', id: id },
        xml('body', {}, body),
        xml('markable', 'urn:xmpp:chat-markers:0'),
        xml('request', 'urn:xmpp:receipts'),
      );

    return this.xmppService.sendStanza(message)
      .pipe(
        catchError(error => {
          console.error('Erro ao enviar mensagem:', error);
          return throwError(() => new Error('Falha ao enviar mensagem'));
        }),
        map(() => {
          const msg = new MessageModel(this.xmppService.jid, to, body, new Date(), id);
          msg.read = true;
          return msg;
        })
      );
  }

  onMessage() {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('message')),
      filter(stanza => !stanza.getChild('composing', 'http://jabber.org/protocol/chatstates') && !stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')),
      filter(stanza => stanza.attrs.to.split('/')[0] === this.xmppService.jid),
      filter(stanza => stanza.getChildText('body')),
      filter(stanza => stanza.attrs.from),
      map(stanza => {
        const body = stanza.getChildText('body');
        const timestamp = new Date();
        const from = stanza.attrs.from.split('/')[0];
        const to = stanza.attrs.to.split('/')[0];
        const messageId = stanza.attrs.id;

        this.sendReceipt(from, messageId).subscribe();

        return new MessageModel(from, to, body, timestamp, messageId, true, false);
      }));
  }

  isTyping(): Observable<any> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('message')),
      filter(stanza => stanza.getChild('composing', 'http://jabber.org/protocol/chatstates') || stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')),
      switchMap(stanza => {
        const from = stanza.attrs.from.split('/')[0];

        if (stanza.getChild('composing', 'http://jabber.org/protocol/chatstates')) {
          return timer(5000).pipe(
            map(() => {
              return { jid: from, isTyping: false };
            }),
            startWith({ jid: from, isTyping: true })
          );
        } else if (stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')) {
          return of({ jid: from, isTyping: false });
        }
        return of({ jid: from, isTyping: false });
      }),
      distinctUntilChanged());
  }

  setTyping(to: string, isTyping: boolean): Observable<any> {
    var message =
      xml('message', { to: to, type: 'chat', id: uuidv4() },
        isTyping ? xml('composing', { xmlns: 'http://jabber.org/protocol/chatstates' }) : xml('paused', { xmlns: 'http://jabber.org/protocol/chatstates' }),
      );

    return this.xmppService.sendStanza(message);
  }

  onMessageFromUser(from: string): Observable<MessageModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('message')),
      filter(stanza => !stanza.getChild('composing', 'http://jabber.org/protocol/chatstates') && !stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')),
      filter(stanza => stanza.attrs.from.split('/')[0] === from),
      map(stanza => {
        const body = stanza.getChildText('body');
        const timestamp = new Date();
        const messageId = stanza.attrs.id;

        this.sendReceipt(stanza.attrs.from, messageId).subscribe();

        return new MessageModel(from, stanza.attrs.to, body, timestamp, messageId);
      }));
  }

  isUserTyping(from: string): Observable<boolean> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('message')),
      filter(stanza => stanza.getChild('composing', 'http://jabber.org/protocol/chatstates') || stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')),
      filter(stanza => stanza.attrs.from.split('/')[0] === from),
      switchMap(stanza => {
        if (stanza.getChild('composing', 'http://jabber.org/protocol/chatstates')) {
          return timer(5000).pipe(
            map(() => false),
            startWith(true)
          );
        } else if (stanza.getChild('paused', 'http://jabber.org/protocol/chatstates')) {
          return of(false);
        }
        return of(false);
      }),
      distinctUntilChanged());
  }

  requestMessagesHistory(id: string, from: string, maxMessages?: number, startDate?: string, endDate?: string): Observable<any> {
    const mamQuery = xml(
      'iq',
      { type: 'set', id: id },
      xml('query', { xmlns: 'urn:xmpp:mam:2' },
        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
          xml('field', { var: 'FORM_TYPE', type: 'hidden' },
            xml('value', {}, 'urn:xmpp:mam:2')
          ),
          xml('field', { var: 'with' },
            xml('value', {}, from)
          ),
          startDate ?
            xml('field ', { var: 'start' },
              xml('value', {}, startDate)
            ) : '',
          endDate ?
            xml('field ', { var: 'end' },
              xml('value', {}, endDate)
            ) : '',
        ),
        maxMessages ?
          xml('set', { xmlns: 'http://jabber.org/protocol/rsm' },
            maxMessages ? xml('max', {}, maxMessages.toString()) : '',
          ) : '',
        xml('flip-page', {}, '')
      )
    );

    return this.xmppService.sendStanza(mamQuery);
  }

  onMessagesHistory(id: string, from: string): Observable<MessageModel> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.getChild('result', 'urn:xmpp:mam:2') != null),
      filter(stanza => stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0') != null),
      filter(stanza => stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0').getChild('message', 'jabber:client') != null),
      filter(stanza =>
        stanza
          .getChild('result', 'urn:xmpp:mam:2')
          .getChild('forwarded', 'urn:xmpp:forward:0')
          .getChild('message', 'jabber:client').attrs.from.split('/')[0] === from ||
        stanza
          .getChild('result', 'urn:xmpp:mam:2')
          .getChild('forwarded', 'urn:xmpp:forward:0')
          .getChild('message', 'jabber:client').attrs.to.split('/')[0] === from),
      takeUntil(this.onMessagesHistoryComplete(id)),
      map(stanza => {
        const result = stanza.getChild('result', 'urn:xmpp:mam:2');
        const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
        const message = forwarded.getChild('message', 'jabber:client');
        const from = message.attrs.from.split('/')[0];
        const delay = forwarded.getChild('delay', 'urn:xmpp:delay');
        const timestamp = new Date(delay.attrs.stamp);
        const body = message.getChildText('body');
        const messageId = message.attrs.id;

        return new MessageModel(from, message.attrs.to, body, timestamp, messageId);
      }),
    );
  }

  onMessagesHistoryComplete(id: string): Observable<any> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.is('iq')),
      filter(stanza => stanza.attrs.id === id),
      filter(stanza => stanza.attrs.type === 'result'),
      filter(stanza => stanza.getChild('fin', 'urn:xmpp:mam:2') != null),
      map(stanza => {
        console.log('Complete');
        return stanza;
      }),
    );
  }

  sendReceipt(to: string, id: string): Observable<any> {
    var message =
      xml('message', { to: to, type: 'chat', id: uuidv4() },
        xml('received', { xmlns: 'urn:xmpp:receipts', id: id }),
      );

    return this.xmppService.sendStanza(message);
  }

  sendReadReceipt(to: string, id: string): Observable<any> {
    var message =
      xml('message', { to: to, type: 'chat', id: uuidv4() },
        xml('displayed', { xmlns: 'urn:xmpp:chat-markers:0', id: id }),
      );

    return this.xmppService.sendStanza(message);
  }
}
