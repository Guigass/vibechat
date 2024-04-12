import { Component, Input, OnInit } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { IonAvatar } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonImg } from '@ionic/angular/standalone';
import { AvatarColorPipe } from 'src/app/shared/pipes/avatar-color/avatar-color.pipe';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    CommonModule,
    IonImg,
    AvatarColorPipe
  ]
})
export class AvatarComponent {
  @Input() user: ContactModel | null | undefined;
}
