import { Component, Input, OnInit } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { IonAvatar } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    CommonModule,
    IonImg
  ]
})
export class AvatarComponent  implements OnInit {
  @Input() user: ContactModel | null | undefined;

  constructor() { }

  ngOnInit() {

    this.getUserOutlineColor();
  }
  getUserOutlineColor(): string {
    if (this.user?.presence?.type === 'online') {
      return 'green';
    } else if (this.user?.presence?.type === 'offline') {
      return 'red';
    } else {
      return 'yellow';
    }

  }
}
