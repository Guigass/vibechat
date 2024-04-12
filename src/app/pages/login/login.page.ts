import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard } from '@ionic/angular/standalone';
import { LoginComponent } from "../../shared/components/login/login.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonContent, LoginComponent, CommonModule]
})
export class LoginPage {

}
