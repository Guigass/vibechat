import { Component, Input, OnInit, input } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { ContactModel } from '../../models/contact.model';
import { IonImg } from "@ionic/angular/standalone";

@Component({
  selector: 'app-image-bubble',
  templateUrl: './image-bubble.component.html',
  styleUrls: ['./image-bubble.component.scss'],
  standalone: true,
  imports:[IonImg,]
})
export class ImageBubbleComponent  implements OnInit {


contact = input<ContactModel>();
message = input<MessageModel>();

  constructor() { }

  ngOnInit() {}

}
