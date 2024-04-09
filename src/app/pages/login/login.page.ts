import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard } from '@ionic/angular/standalone';
import { LoginComponent } from "../../shared/components/login/login.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonCard, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LoginComponent]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('login');
  }

}
