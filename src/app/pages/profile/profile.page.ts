import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { AvatarComponent } from "../../shared/components/avatar/avatar.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, AvatarComponent]
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
