import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonAvatar,
  IonImg,
  IonTextarea,
  IonFooter,
  IonItem,
} from '@ionic/angular/standalone';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonFooter,
    IonTextarea,
    IonImg,
    IonAvatar,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    AvatarComponent,
    RouterLink
  ],
})
export class DefaultPage implements OnInit {
  private db = inject(DatabaseService);

  constructor() {}

  ngOnInit() {}

  goToProfile() {
  }
}
