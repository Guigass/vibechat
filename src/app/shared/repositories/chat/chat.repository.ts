import { ContactRepository } from './../contact/contact.repository';
import { Injectable, inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { DatabaseService } from '../../services/database/database.service';
import { BehaviorSubject, Observable, Subject, of, switchMap, take, tap } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { MessageModel } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatRepository {
  private xmppService = inject(XmppService);
  private chatService = inject(ChatService);
  private contactRepository = inject(ContactRepository);
  private db = inject(DatabaseService);

  private messages$: BehaviorSubject<MessageModel | null> = new BehaviorSubject<MessageModel | null>(null);
  public messages: Observable<MessageModel | null> = this.messages$.asObservable();

  constructor() { 
    this.init();
  }

  private init(): void {
    // this.watchforNewMessages();
    // this.watchUserTypingState();
    // this.watchMessagesFromServer();
  }

  sendMessage(body: string, to: string): Observable<MessageModel> {
    return this.chatService.sendMessage(body, to).pipe(
      switchMap(message => {
        return this.saveMessage(message);
      }),
      tap((message) => {
        this.messages$.next(message);
      })
    );
  }

  getLastMessage(contact: string): Observable<any> {
    const key = this.getMessageKeyPrefix(contact);
    return this.db.getAllDataKeys(key).pipe(
      switchMap((keys) => {
        if (keys.length === 0) {
          return of();
        }
        
        let keysData: any[] = keys.map(key => {
          var data = key.split('_d:')[1];
          return { data: new Date(data), key: key };
        });
  
        keysData.sort((a, b) => (a.data > b.data ? -1 : 1));

        return this.db.getData(keysData[0].key);
      })
    );
  }

  getMessages(contact: string): Observable<MessageModel[]> {
    const key = this.getMessageKeyPrefix(contact);

    return this.db.getAllData(key);
  }

  getQtdUnreadMessages(contact: string): Observable<number> {
    return this.getMessages(contact).pipe(
      switchMap((messages) => {
        return of(messages.filter((message) => message.read === false).length);
      })
    );
  }

  getSetMessagesAsRead(contact: string): Observable<MessageModel[]> {
    return this.getMessages(contact).pipe(
      switchMap((messages) => {
        messages.forEach((message) => {
          message.read = true;
          this.updateMessage(message).subscribe();
        });

        return of(messages);
      })
    );
   
  };

  watchUserTypingState(){
    this.chatService.isTyping().subscribe((typing) => {
      this.contactRepository.getContact(typing.jid).subscribe((contact) => {
        if(contact){
          contact.isTyping = typing.isTyping;
          this.contactRepository.updateContact(contact).subscribe();
        }
      });
    });
  }

  sendTypingState(to: string, isTyping: boolean){
    return this.chatService.setTyping(to, isTyping);
  }

  requestMessagesHistory(contact: string, limit: number, before: string): void {
    this.chatService.requestMessagesHistory(contact, limit, before).subscribe();
  }

  private saveMessage(message: MessageModel): Observable<MessageModel> {
    const key = this.getMessageKeyPrefix(message.from, message.to);
    const keyDate = `${key}_d:${message.timestamp.toISOString()}`;

    message.dbKey = keyDate;

    return this.db.getData(keyDate).pipe(
      switchMap((data) => {
        if (data){
          return of(data)
        } else {
          return this.db.addData(keyDate, message);
        }
      })
    )
  }

  private updateMessage(message: MessageModel): Observable<MessageModel> {
    return this.db.addData(message.dbKey!, message);
  }

  private getMessageKeyPrefix(contact1: string, contact2?: string): string {
    if (!contact2) {
      contact2 = this.xmppService.jid;
    }

    const contacts = [contact1, contact2].sort();
    return `m_${contacts[0]}_${contacts[1]}`;
  }

  private watchforNewMessages(): void {
    this.chatService.onMessage().subscribe((message) => {
      this.saveMessage(message).subscribe();

      this.messages$.next(message);
    });
  }

  private watchMessagesFromServer(): void {
    this.chatService.getMessagesHistory().subscribe((message) => {
      this.saveMessage(message).subscribe();
    });
  }
}
