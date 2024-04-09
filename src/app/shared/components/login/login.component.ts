import { UserPreferenceService } from './../../services/user-preference/user-preference.service';
import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonInput, IonText, ToastController, IonCheckbox, IonLabel, IonItem, IonIcon, NavController } from "@ionic/angular/standalone";
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enun';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, 
    IonText, 
    IonInput, 
    IonButton, 
    IonCol, 
    IonRow, 
    IonCardContent, 
    IonCardTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    ReactiveFormsModule,
    IonCheckbox,
    IonItem,
    IonIcon
  ]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private userPreferenceService = inject(UserPreferenceService);
  private navController = inject(NavController);
  private toastController = inject(ToastController);

  loginForm = new FormGroup({
    server: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
    autoLogin: new FormControl(false)
  });

  showPassword = false;

  constructor() {
    addIcons({
      eye,
      eyeOff
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  ionViewDidEnter(){
    this.loadPreferences();
  }

  loadPreferences(){
    const preferences = this.userPreferenceService.getPreference<LoginModel>(PreferencesKey.UserCredentials);

    if(preferences?.rememberMe){
      this.loginForm.setValue(preferences);
    }
  }

  login(): void {
    this.loginForm.markAllAsTouched();

    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value as LoginModel).subscribe((logged) => {
        if(!logged){
          this.presentErrorToast();
          return;
        }
        
        this.navController.navigateRoot('/home');
      });
    }
   
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Ocorreu um erro ao tentar logar. Verifique as credenciais e tente novamente.',
      duration: 1500,
      position: 'bottom',
      color: 'danger'
    });

    await toast.present();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
