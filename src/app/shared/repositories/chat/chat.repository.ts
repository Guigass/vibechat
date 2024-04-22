import { ContactRepository } from './../contact/contact.repository';
import { Injectable, NgZone, inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { from, Observable, Subject, concatMap, filter, merge, mergeMap, of, switchMap, take, tap, toArray, map, EMPTY, concat, share, BehaviorSubject, defer } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { MessageModel } from '../../models/message.model';
import { Database2Service } from '../../services/database/database2.service';
import { v4 as uuidv4 } from 'uuid';
import { liveQuery } from 'dexie';
import { RequestMessageFilter } from '../../models/request-message-filter';

@Injectable({
  providedIn: 'root'
})
export class ChatRepository {
  private xmppService = inject(XmppService);
  private chatService = inject(ChatService);
  private contactRepository = inject(ContactRepository);
  private db = inject(Database2Service);
  private ngZone = inject(NgZone);

  private message: Subject<MessageModel> = new Subject<MessageModel>();

  constructor() {
    this.db.dbReady.pipe(filter(ready => ready)).subscribe(() => {
      this.init();
    });
  }

  private init(): void {
    this.watchforNewMessages();
    // this.watchUserTypingState();
    // this.watchMessagesFromServer();
  }

  sendMessage(body: string, to: string): Observable<any> {
    return this.chatService.sendMessage(body, to).pipe(
      switchMap((message) => {
        return from(this.db.messages.add(message)).pipe(
          tap((msgId) => {
            message.id = msgId;
            this.message.next(message);
          })
        );
      })
    );
  }

  getMessages(jid: string, take: number, skip: number): Observable<MessageModel[]> {
    return defer(() => from(
      this.db.messages
        .orderBy('timestamp')
        .filter(msg => msg.from === jid || msg.to === jid)
        .offset(skip)
        .limit(take)
        .reverse()
        .toArray()
    ));
  }

  getMessagesChanges(id: number): Observable<any> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      switchMap((ready) => {
        return liveQuery(() => this.db.messages.where('id').equals(id).first());
      }),
      share()
    );
  }

  getNewMessages(jid: string): Observable<any> {
    return this.message.asObservable().pipe(
      filter(message => message.from === jid || message.to === jid),
      share()
    )
  }

  getLastSyncedMessageId(jid: string): Observable<number | undefined> {
    return from(this.db.messages.orderBy('timestamp')
    .filter(p => (p.from == jid || p.to == jid) && (p.resultId !== undefined || p.resultId !== null)).last()).pipe(
      map((message) => {
        return message?.resultId;
      })
    );
  }

  syncServerMessages(jid: string): Observable<any> {
    var id = uuidv4();

    return this.getLastSyncedMessageId(jid).pipe(
      switchMap((lastSyncedId) => {
        return this.chatService.requestMessagesHistory(id, {
          afterId: lastSyncedId,
          with: jid
        })
      }),
      switchMap(() => {
        return this.chatService.onMessagesHistory(id, jid);
      }),
      filter(serverMessage => serverMessage.body !== ''),
      concatMap(serverMessage => {
        return from(this.db.messages.where('serverId').equals(serverMessage.serverId).first()).pipe(
          switchMap(message => {
            if (!message) {
              return from(this.db.messages.add(serverMessage)).pipe(map(() => serverMessage));
            } else {
              return from(this.db.messages.update(serverMessage.id!, serverMessage))
            }
          })
        )
      }),
    );
  }

  loadMessages(jid: string): Observable<any> {
    return this.getLastSyncedMessageId(jid).pipe(
      switchMap((lastSyncedId) => {
        return this.loadMessagesFromServer(jid, {
          afterId: lastSyncedId,
          with: jid
        }).pipe(
          concatMap(serverMessage => {
            return from(this.db.messages.where('serverId').equals(serverMessage.serverId).count()).pipe(
              switchMap(count => {
                if (count === 0) {
                  return from(this.db.messages.add(serverMessage)).pipe(map(() => serverMessage));
                } else {
                  return from (this.db.messages.update(serverMessage.id!, serverMessage))
                }
              })
            )
          }),
        )
      })
    )
  }

  loadMessagesFromServer(from: string, filter: RequestMessageFilter): Observable<any> {
    var id = uuidv4();

    return this.chatService.requestMessagesHistory(id, filter).pipe(
      take(1),
      switchMap(() => {
        return this.chatService.onMessagesHistory(id, from);
      })
    );
  }


  private watchforNewMessages(): void {
    this.chatService.onMessage().subscribe((message) => {
      this.ngZone.run(() => {
        this.db.messages.add(message).then((msgId) => {
          message.id = msgId;
          this.message.next(message);
        });
      });
    });
  }
}
