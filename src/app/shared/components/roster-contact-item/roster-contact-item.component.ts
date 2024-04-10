import { ChatService } from './../../services/chat/chat.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { Subscription } from 'rxjs';
import { IonIcon, IonContent, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, IonImg, IonRow, IonCol, IonAvatar } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personOutline, person} from 'ionicons/icons';

@Component({
  selector: 'app-roster-contact-item',
  templateUrl: './roster-contact-item.component.html',
  styleUrls: ['./roster-contact-item.component.scss'],
  standalone: true,
  imports: [IonAvatar, IonCol, IonRow,
    IonImg,
    IonCardSubtitle,
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
  ]
})
export class RosterContactItemComponent implements OnInit {
  @Input() contact!: ContactModel;

  private presenceService = inject(PresenceService);
  private chatService = inject(ChatService);

  private presenceSubscription!: Subscription;

  constructor() {
    addIcons({
      personOutline,
      person
    })
  }

  ngOnInit() {
    console.log(this.contact);

    this.presenceSubscription = this.presenceService
      .getPresenceFromUser(this.contact.jid)
      .subscribe((presence) => {
        this.contact.presence = presence;
      });

      // this.chatService.getMessagesHistory(this.contact.jid).subscribe((message) => {
      //   console.log( 'ae',message);
      // });

      // this.chatService.requestMessagesHistory(this.contact.jid, 1).subscribe();
  }

  ngOnDestroy(): void {
    this.presenceSubscription?.unsubscribe();
  }
  }

