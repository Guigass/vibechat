import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MessageBubbleComponent  implements OnInit {
  @Input() message!: MessageModel ;

  constructor() { }

  ngOnInit() {
  }

}
