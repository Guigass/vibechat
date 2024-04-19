import { Component, Input, OnInit } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { ContactModel } from '../../models/contact.model';

@Component({
  selector: 'app-image-bubble',
  templateUrl: './image-bubble.component.html',
  styleUrls: ['./image-bubble.component.scss'],
  standalone: true,
  imports:[]
})
export class ImageBubbleComponent  implements OnInit {

@Input() message!: MessageModel;
@Input() user!: ContactModel | null | undefined;

  constructor() { }

  ngOnInit() {}

}
