import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonAvatar, IonImg, IonTextarea, IonFooter } from '@ionic/angular/standalone';

@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
  standalone: true,
  imports: [IonFooter, IonTextarea, IonImg, IonAvatar, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton]
})
export class DefaultPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goToProfile() {
    console.log('goToProfile');
  }
}
