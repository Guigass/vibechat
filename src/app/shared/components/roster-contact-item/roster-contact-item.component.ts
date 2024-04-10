import { ChatService } from './../../services/chat/chat.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roster-contact-item',
  templateUrl: './roster-contact-item.component.html',
  styleUrls: ['./roster-contact-item.component.scss'],
  standalone: true,
})
export class RosterContactItemComponent implements OnInit, OnDestroy {
  @Input() contact!: ContactModel;

  private presenceService = inject(PresenceService);
  private chatService = inject(ChatService);

  private presenceSubscription!: Subscription;

  constructor() {
  }

  ngOnInit() {
    console.log(this.contact);

    this.presenceSubscription = this.presenceService
      .getPresenceFromUser(this.contact.jid)
      .subscribe((presence) => {
        this.contact.presence = presence;
      });

      // this.chatService.getMessagesHistory(this.contact.jid).subscribe((message) => {
      //   console.log(message);
      // });

      // this.chatService.requestMessagesHistory(this.contact.jid, 1).subscribe();
  }

  ngOnDestroy(): void {
    this.presenceSubscription?.unsubscribe();
  }
}
