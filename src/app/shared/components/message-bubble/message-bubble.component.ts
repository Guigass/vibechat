import { Component, Input, OnInit, inject } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { IonItem } from "@ionic/angular/standalone";
import { AvatarComponent } from '../avatar/avatar.component';
import { ContactModel } from '../../models/contact.model';
import { ContactRepository } from '../../repositories/contact/contact.repository';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  imports: [IonItem, CommonModule,AvatarComponent],
})
export class MessageBubbleComponent implements OnInit {
  private contactRepository = inject(ContactRepository);
  @Input() message!: MessageModel;
  @Input() user!:ContactModel | null;

  constructor() { }

  ngOnInit(): void {
    this.contactRepository.getContact(this.userId).subscribe((contact) => {
      this.contact = contact;
    });
  };

}
