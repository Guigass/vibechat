import { xml } from '@xmpp/client';
import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { v4 as uuidv4 } from 'uuid';
import {  Observable, catchError, distinctUntilChanged, filter, map, of, startWith, switchMap, throwError, timer } from 'rxjs';
import { MessageModel } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private xmppService = inject(XmppService);

  sendMessage(message: string, to: string): Observable<any> {
    return this.xmppService.sendStanza(xml('message', { to: to, type: 'chat', id: uuidv4() }, xml('body', {}, message))).pipe(
      catchError(error => {
        console.error('Erro ao enviar mensagem:', error);
        return throwError(() => new Error('Falha ao enviar mensagem'));
      })
    );
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
        const type = 'received';

        return new MessageModel(from, stanza.attrs.to, body, timestamp, messageId, type);
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

  requestMessagesHistory(from: string, maxMessages: number, before?: string): Observable<void> {
    const mamQuery = xml(
      'iq',
      { type: 'set', id: 'mam-query' },
      xml('query', { xmlns: 'urn:xmpp:mam:2' },
        xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
          xml('field', { var: 'FORM_TYPE', type: 'hidden' },
            xml('value', {}, 'urn:xmpp:mam:2')
          ),
          xml('field', { var: 'with' },
            xml('value', {}, from)
          ),
        ),
        xml('set', { xmlns: 'http://jabber.org/protocol/rsm' },
          xml('max', {}, maxMessages.toString()),
          before ? xml('before', {}, before) : xml('before', {})
        )
      )
    );

    return this.xmppService.sendStanza(mamQuery);
  }

  getMessagesHistory(from: string): Observable<MessageModel> {
    return this.xmppService.onStanza$.pipe(
      // Filtra para processar apenas mensagens relevantes
      filter(stanza =>
        stanza.is('message') &&
        stanza.getChild('result', 'urn:xmpp:mam:2').getChild('forwarded', 'urn:xmpp:forward:0').getChild('message', 'jabber:client').attrs.from.split('/')[0] === from &&
        stanza.getChild('result', 'urn:xmpp:mam:2') != null
      ),
      map(stanza => {
        const result = stanza.getChild('result', 'urn:xmpp:mam:2');
        const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
        const message = forwarded.getChild('message', 'jabber:client');
        const delay = forwarded.getChild('delay', 'urn:xmpp:delay');
        const timestamp = new Date(delay.attrs.stamp);
        const body = message.getChildText('body');
        const messageId = result.attrs.id;

        const type = message.attrs.from.includes(from) ? 'received' : 'sent';

        return new MessageModel(from, message.attrs.to, body, timestamp, messageId, type);
      })
    );
  }
}
