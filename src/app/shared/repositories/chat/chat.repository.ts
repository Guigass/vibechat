import { ContactRepository } from './../contact/contact.repository';
import { Injectable, NgZone, inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { DatabaseService } from '../../services/database/database.service';
import { BehaviorSubject, Observable, Subject, filter, of, switchMap, take, tap } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { MessageModel } from '../../models/message.model';
import { Database2Service } from '../../services/database/database2.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRepository {
  private chatService = inject(ChatService);
  private contactRepository = inject(ContactRepository);
  private db = inject(Database2Service);
  private ngZone = inject(NgZone);

  constructor() {
    this.db.dbReady.pipe(filter(ready => ready)).subscribe(() => {
      this.init();
    });
  }

  private init(): void {
    // this.watchforNewMessages();
    // this.watchUserTypingState();
    // this.watchMessagesFromServer();
  }

  loadMessagesFromServer(from: string, maxMessages?: number, startDate?: string, endDate?: string): void {
    this.chatService.requestMessagesHistory(from, maxMessages, startDate, endDate).subscribe();

    this.chatService.onMessagesHistory(from).subscribe((resp) => {
      console.log('resp', resp);

    })
  }
}
