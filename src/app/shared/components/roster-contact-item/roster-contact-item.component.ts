import { ChatService } from './../../services/chat/chat.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { Subscription } from 'rxjs';
import { IonIcon, IonBadge, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, IonImg, IonRow, IonCol, IonAvatar, IonItem, IonGrid, IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personOutline, person } from 'ionicons/icons';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MessageModel } from '../../models/message.model';
import { DataPipe } from '../../pipes/data/data.pipe';

@Component({
  selector: 'app-roster-contact-item',
  templateUrl: './roster-contact-item.component.html',
  styleUrls: ['./roster-contact-item.component.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonCardSubtitle,
    CommonModule,
    IonItem,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
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

  private presenceSubscription!: Subscription;

  lastMessage!: MessageModel;

  constructor() {
    addIcons({
      personOutline,
      person
    })
  }

  ngOnInit() {
    this.presenceSubscription = this.presenceService
      .getPresenceFromUser(this.contact.jid)
      .subscribe((presence) => {
        this.contact.presence = presence;
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

