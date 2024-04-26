import { Component, Input, OnInit, input } from '@angular/core';
import { MessageModel } from '../../models/message.model';
import { ContactModel } from '../../models/contact.model';
import { IonImg, IonItem } from "@ionic/angular/standalone";
import { AvatarComponent } from "../avatar/avatar.component";
import { ModalController } from '@ionic/angular/standalone';
import { ImageModalComponent } from './image-modal/image-modal.component';

@Component({
    selector: 'app-image-bubble',
    templateUrl: './image-bubble.component.html',
    styleUrls: ['./image-bubble.component.scss'],
    standalone: true,
    imports: [IonImg, IonItem, AvatarComponent]
})
export class ImageBubbleComponent  implements OnInit {


contact = input<ContactModel>();
message = input<MessageModel>();

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}
  async openImage() {
      const modal = await this.modalCtrl.create({
          component: ImageModalComponent,
          componentProps: {image: this.message()?.body},
      });
      modal.onWillDismiss().then((data) => {
        if(data.data) {
          // console.log(data.data)
        }
      })
      return await modal.present();
  }

}
