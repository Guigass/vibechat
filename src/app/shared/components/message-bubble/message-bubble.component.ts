import { UserInfoService } from './../../services/user-info/user-info.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, input } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { IonItem } from "@ionic/angular/standalone";
import { AvatarComponent } from '../avatar/avatar.component';
import { ContactModel } from '../../models/contact.model';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { AuthService } from '../../services/auth/auth.service';
import { VCardModel } from '../../models/vcard.model';
import { PresenceType } from '../../enums/presence-type.enum';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, CommonModule,AvatarComponent],
})
export class MessageBubbleComponent implements OnInit {
  private authService = inject(AuthService);

  message = input<MessageModel>();
  contact = input<ContactModel>();
  userInfo!: ContactModel;

  constructor() { }

  ngOnInit(): void { 
    this.authService.userInfo$.subscribe(userInfo => {
      //Converte vcard para contactmodel
      this.userInfo = {
        id: 0,
        jid: userInfo.jid,
        name: userInfo.fullname,
        groups: [],
        subscription: '',
        hidden: false,
        isTyping: false,
        presence: {jid: '', type: PresenceType.Online}
      }
    });
  }

}
