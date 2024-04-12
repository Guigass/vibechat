import { Component, Input, OnInit, inject } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { IonItem } from "@ionic/angular/standalone";
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  imports: [IonItem, CommonModule,AvatarComponent],
})
export class MessageBubbleComponent implements OnInit {
  @Input() message!: MessageModel;

  constructor() { }

  ngOnInit(): void {console.log(this.message)};

}
