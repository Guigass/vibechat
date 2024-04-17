import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { IonAvatar } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonImg } from '@ionic/angular/standalone';
import { AvatarColorPipe } from 'src/app/shared/pipes/avatar-color/avatar-color.pipe';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { Subscription, filter, tap } from 'rxjs';
import { PresenceModel } from '../../models/presence.model';
import { VCardModel } from '../../models/vcard.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    CommonModule,
    IonImg,
    AvatarColorPipe
  ]
})
export class AvatarComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private contactRepository = inject(ContactRepository);

  private persenceSubscription!: Subscription;
  private contactInfoSubscription!: Subscription;

  @Input() user: ContactModel | null | undefined;

  presence!: PresenceModel;
  contactInfo!: VCardModel;

  ngAfterViewInit(): void {
    if (!this.user) {
      return;
    }

    this.persenceSubscription = this.contactRepository.getContactPresenceChanges(this.user?.jid!).pipe(
      filter(presence => presence !== undefined),
      filter(presence => presence !== null && this.user !== null && presence!.jid === this.user?.jid)
    ).subscribe((presence) => {
      this.presence = presence!;
      this.cdr.markForCheck();
    });

    this.contactInfoSubscription = this.contactRepository.getContactInfoChanges(this.user?.jid!).pipe(
      filter(contactInfo => contactInfo !== undefined),
      filter(contactInfo => contactInfo !== null && this.user !== null && contactInfo!.jid === this.user?.jid)
    ).subscribe((contactInfo) => {
      this.contactInfo = contactInfo!;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.persenceSubscription?.unsubscribe();
    this.contactInfoSubscription?.unsubscribe();
  }
}
