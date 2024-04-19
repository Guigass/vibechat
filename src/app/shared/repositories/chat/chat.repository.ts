import { ContactRepository } from './../contact/contact.repository';
import { Injectable, NgZone, inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { from, Observable, Subject, concatMap, filter, merge, mergeMap, of, switchMap, take, tap, toArray, map, EMPTY, concat, share, BehaviorSubject } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { MessageModel } from '../../models/message.model';
import { Database2Service } from '../../services/database/database2.service';
import { v4 as uuidv4 } from 'uuid';
import { liveQuery } from 'dexie';

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
      tap((message) => {

        //this.db.messages.add(message);
        this.message.next(message);
      })
    );
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

  loadMessages(fromJid: string, maxMessages: number, startDate?: string, endDate?: string): Observable<any> {
    const serverMessages$ = this.loadMessagesFromServer(fromJid, maxMessages, startDate, endDate).pipe(
      filter(message => message !== null && message.serverId !== undefined),
      concatMap(serverMessage => {
        return from(this.db.messages.where('serverId').equals(serverMessage.serverId).count()).pipe(
          switchMap(count => {
            if (count === 0) {
              return from(this.db.messages.add(serverMessage)).pipe(map(() => serverMessage));
            }
            return of(null);
          })
        )
      }),
      filter(message => message !== null)
    );

    const localMessages$ = from(this.db.messages.where('from').equals(fromJid).or('to').equals(fromJid).limit(maxMessages).toArray());

    return merge(localMessages$, serverMessages$).pipe(
      toArray(),
      map(messages => messages.flat()),
      map(messages => messages.sort((a, b) => a.timestamp - b.timestamp))
    );
  }

  loadMessagesFromServer(from: string, maxMessages?: number, startDate?: string, endDate?: string): Observable<any> {
    var id = uuidv4();
    return this.chatService.requestMessagesHistory(id, from, maxMessages, startDate, endDate).pipe(
      take(1),
      switchMap(() => {
        return this.chatService.onMessagesHistory(id, from);
      })
    );
  }

  private watchforNewMessages(): void {
    this.chatService.onMessage().subscribe((message) => {
      this.ngZone.run(async () => {
        this.message.next(message);
        await this.db.messages.add(message);
      });
    });
  }
}
