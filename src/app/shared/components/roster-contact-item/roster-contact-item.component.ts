import { ChatService } from './../../services/chat/chat.service';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { Subscription, catchError, distinct, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { IonIcon, IonBadge, IonImg, IonAvatar, IonItem } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MessageModel } from '../../models/message.model';
import { DataPipe } from '../../pipes/data/data.pipe';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { AvatarComponent } from '../avatar/avatar.component';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { XmppService } from '../../services/xmpp/xmpp.service';

@Component({
  selector: 'app-roster-contact-item',
  templateUrl: './roster-contact-item.component.html',
  styleUrls: ['./roster-contact-item.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonAvatar,
    IonImg,
    CommonModule,
    IonItem,
    IonBadge,
    IonIcon,
    RouterLink,
    RouterLinkActive,
    DataPipe,
    AvatarComponent
  ]
})
export class RosterContactItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() contact!: ContactModel;

  public xmpp = inject(XmppService);
  private chatRepository = inject(ChatRepository);
  private contactRepository = inject(ContactRepository);

  private contactSubscription!: Subscription;
  private messagesSubscription!: Subscription;

  unreadMessages = 0;
  lastMessage!: MessageModel | null;

  constructor() {
  }

  ngOnInit() {
    this.contactSubscription = this.contactRepository.contactUpdate.pipe(
      filter((contact) => contact != null && contact.jid === this.contact.jid),
      switchMap(contact => {
        this.contact = contact!;
        return this.chatRepository.getLastMessage(this.contact.jid).pipe(
          catchError(err => {
            console.error('Erro ao obter a última mensagem:', err);
            return of(null);
          })
        );
      })
    ).subscribe(message => {
      if (message) {
        this.lastMessage = message;
      }
    });
  }

  ngAfterViewInit(): void {
    this.messagesSubscription = this.chatRepository.messages.pipe(
      filter((message) => message != null),
      filter((message) => message?.from === this.contact.jid || message?.to === this.contact.jid)
    ).subscribe((message) => {
      this.lastMessage = message;
    });
  }

  ngOnDestroy(): void {
    this.contactSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
  }
}

