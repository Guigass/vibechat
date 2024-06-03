import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { Subscription } from 'rxjs';
import { IonIcon, IonBadge, IonImg, IonAvatar, IonItem } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MessageModel } from '../../models/message.model';
import { DataPipe } from '../../pipes/data/data.pipe';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { AvatarComponent } from '../avatar/avatar.component';
import { VCardModel } from '../../models/vcard.model';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-roster-contact-item',
  templateUrl: './roster-contact-item.component.html',
  styleUrls: ['./roster-contact-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class RosterContactItemComponent implements OnInit, OnDestroy {
  @Input() contact!: ContactModel;

  private cdr = inject(ChangeDetectorRef);

  private contactRepository = inject(ContactRepository);
  private chatService = inject(ChatService);

  private contactInfoSubscription!: Subscription;

  contactInfo!: VCardModel;

  unreadMessages = 0;
  lastMessage!: MessageModel | null;

  isTyping = false;

  constructor() {
  }

  ngOnInit() {
    this.contactInfoSubscription = this.contactRepository.getContactInfoChanges(this.contact.jid).subscribe(contactInfo => {
      if (contactInfo) {
        this.contactInfo = contactInfo;
        this.cdr.detectChanges();
      }
    });

    this.chatService.isUserTyping(this.contact.jid).subscribe(isTyping => {
      this.isTyping = isTyping;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.contactInfoSubscription?.unsubscribe();
  }
}

