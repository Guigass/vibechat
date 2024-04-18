import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
export class RosterContactItemComponent implements OnInit, OnDestroy {
  @Input() contact!: ContactModel;

  private cdr = inject(ChangeDetectorRef);

  private contactRepository = inject(ContactRepository);

  private contactInfoSubscription!: Subscription;

  contactInfo!: VCardModel;


  unreadMessages = 0;
  lastMessage!: MessageModel | null;

  constructor() {
  }

  ngOnInit() {
    this.contactInfoSubscription = this.contactRepository.getContactInfoChanges(this.contact.jid).subscribe(contactInfo => {
      this.contactInfo = contactInfo!;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.contactInfoSubscription?.unsubscribe();
  }
}

