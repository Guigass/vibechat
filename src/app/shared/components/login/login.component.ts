import { UserPreferenceService } from './../../services/user-preference/user-preference.service';
import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonInput, IonText, ToastController, IonCheckbox, IonLabel, IonItem, IonIcon, NavController, LoadingController, IonLoading } from "@ionic/angular/standalone";
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enun';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { of, switchMap, map, take } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';

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
    IonIcon,
    IonLoading
  ]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private xmppService = inject(XmppService);
  private userPreferenceService = inject(UserPreferenceService);
  private navController = inject(NavController);
  private toastController = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  loginForm = new FormGroup({
    server: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
    autoLogin: new FormControl(false)
  });

  showPassword = false;

  isLoading = false;
  loadingMessage = 'Autenticando...';

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

    if(this.loginForm.valid) {
      this.loadingMessage = 'Autenticando...';
      this.isLoading = true;

      this.authService.login(this.loginForm.value as LoginModel).pipe(
        switchMap((logged) => {
          if(!logged){
            this.presentErrorToast();
            return of(false);
          }

          this.loadingMessage = 'Autenticado, Conectando...';

          if (this.xmppService.isConnected) {
            return of(true);
          }

          return this.xmppService.onOnline$.pipe(take(1), map(() => true));
        })
      ).subscribe((logged) => {
        if(logged){
          this.isLoading = false;
          this.navController.navigateRoot('/home');
        }
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
