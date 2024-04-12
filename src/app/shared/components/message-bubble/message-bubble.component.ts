import { Component, Input, OnInit, inject } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { ChatRepository } from '../../repositories/chat/chat.repository';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MessageBubbleComponent {
  @Input() message!: MessageModel;

  constructor() { }
}
