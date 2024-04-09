import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonInput, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonButton, IonCol, IonRow, IonCardContent, IonCardTitle, IonContent, IonCard, IonCardHeader]
})
export class LoginComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('login');
  }

}
