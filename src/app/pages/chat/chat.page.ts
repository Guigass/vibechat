import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, IonButton]
})
export class ChatPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
