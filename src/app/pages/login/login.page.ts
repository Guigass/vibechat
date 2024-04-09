import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard } from '@ionic/angular/standalone';
import { LoginComponent } from "../../shared/components/login/login.component";
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonContent, LoginComponent]
})
export class LoginPage {

}
