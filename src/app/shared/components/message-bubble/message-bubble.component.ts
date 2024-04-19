import { ChangeDetectionStrategy, Component, Input, OnInit, inject, input } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { IonItem } from "@ionic/angular/standalone";
import { AvatarComponent } from '../avatar/avatar.component';
import { ContactModel } from '../../models/contact.model';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { XmppService } from '../../services/xmpp/xmpp.service';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, CommonModule,AvatarComponent],
})
export class MessageBubbleComponent implements OnInit {
  private contactRepository = inject(ContactRepository);

  message = input<MessageModel>();
  user = input<ContactModel>();

  constructor() { }

  ngOnInit(): void { }

}
