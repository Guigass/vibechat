import { ContactRepository } from './../contact/contact.repository';
import { Injectable, inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { DatabaseService } from '../../services/database/database.service';
import { BehaviorSubject, Observable, Subject, of, switchMap, tap } from 'rxjs';
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
    this.watchforNewMessages();
    this.watchUserTypingState();
  }

  sendMessage(body: string, to: string): Observable<MessageModel> {
    return this.chatService.sendMessage(body, to).pipe(
      switchMap(message => {
        console.log(message);
        return this.saveMessage(message);
      })
    );
  }

  private saveMessage(message: MessageModel): Observable<MessageModel> {
    const key = this.getMessageKeyPrefix(message.from, message.to);
    return this.db.addData(`${key}_d:${message.timestamp.toISOString()}`, message);
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

        return this.db.getData(keysData[0].key).pipe(tap((message) => {console.log(message)}));
      })
    );
  }

  getMessages(contact: string): Observable<MessageModel[]> {
    const key = this.getMessageKeyPrefix(contact);

    return this.db.getAllData(key);
  }

  watchUserTypingState(){
    this.chatService.isTyping().subscribe((typing) => {
      console.log(typing);
      this.contactRepository.getContact(typing.jid).subscribe((contact) => {
        if(contact){
          contact.isTyping = typing.isTyping;
          this.contactRepository.updateContact(contact).subscribe();
        }
      });
    });
  }
}
