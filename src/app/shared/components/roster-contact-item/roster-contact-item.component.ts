import { ChatService } from './../../services/chat/chat.service';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { Subscription, filter } from 'rxjs';
import { IonIcon, IonBadge, IonImg, IonAvatar, IonItem } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personOutline, person } from 'ionicons/icons';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MessageModel } from '../../models/message.model';
import { DataPipe } from '../../pipes/data/data.pipe';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { AvatarComponent } from '../avatar/avatar.component';

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

  private chatService = inject(ChatService);
  private chatRepository = inject(ChatRepository);
  private contactRepository = inject(ContactRepository);

  private contactSubscription!: Subscription;
  private messagesSubscription!: Subscription;


  lastMessage!: MessageModel | null;

  constructor() {
    addIcons({
      personOutline,
      person
    })
  }


  ngOnInit() {
    this.contactSubscription = this.contactRepository.contactUpdate.pipe(
      filter((contact) => contact != null && contact.jid === this.contact.jid)
    ).subscribe((contact) => {
      this.contact = contact!;

      this.chatRepository.getLastMessage(this.contact.jid).subscribe((message) => {
        this.lastMessage = message;
      });

      this.chatRepository.getMessages(this.contact.jid).subscribe((messages) => {
        console.log(messages);
      })
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

