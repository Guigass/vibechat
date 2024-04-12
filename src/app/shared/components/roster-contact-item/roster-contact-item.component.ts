import { ChatService } from './../../services/chat/chat.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
    DataPipe
  ]
})
export class RosterContactItemComponent implements OnInit, OnDestroy {
  @Input() contact!: ContactModel;

  private presenceService = inject(PresenceService);
  private chatService = inject(ChatService);
  private contactRepository = inject(ContactRepository);

  private presenceSubscription!: Subscription;
  private contactSubscription!: Subscription;

  lastMessage!: MessageModel;

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
    });

    this.chatService.getMessagesHistory(this.contact.jid).subscribe((message) => {
      this.lastMessage = message;
    });

    this.chatService.requestMessagesHistory(this.contact.jid, 1).subscribe();
  }
  ngOnDestroy(): void {
    this.presenceSubscription?.unsubscribe();
  }
}

