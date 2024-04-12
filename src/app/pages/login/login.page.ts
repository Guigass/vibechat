import { Component } from '@angular/core';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { LoginComponent } from "../../shared/components/login/login.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonImg, IonContent, LoginComponent, CommonModule]
})
export class LoginPage {

}
