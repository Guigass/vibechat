import { UserPreferenceService } from './../../services/user-preference/user-preference.service';
import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonInput, IonText, ToastController, IonCheckbox, IonLabel, IonItem, IonIcon, NavController, LoadingController, IonLoading } from "@ionic/angular/standalone";
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { PreferencesKey } from '../../enums/preferences.enun';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { of, switchMap, map, take, Observable } from 'rxjs';
import { XmppService } from '../../services/xmpp/xmpp.service';
import { StorageService } from '../../services/storage/storage.service';

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
  private storageService = inject(StorageService);
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

  isLoading = false;
  loadingMessage = 'Autenticando...';

  constructor() {
    this.processLogin(this.authService.checkAutoLogin())
    
    addIcons({
      eye,
      eyeOff
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(){
    const preferences = this.storageService.getItem<LoginModel>(PreferencesKey.UserCredentials);

    if(preferences?.rememberMe){
      this.loginForm.setValue(preferences);
    }
  }

  login(): void {
    this.loginForm.markAllAsTouched();

    if(this.loginForm.valid) {
      this.processLogin(this.authService.login(this.loginForm.value as LoginModel))
    }
   
  }

  processLogin(login: Observable<boolean>, autoLogin = false){
    if (autoLogin) {
      this.loadingMessage = 'Autenticando...';
      this.isLoading = true;
    }

    login.pipe(
      switchMap((logged) => {
        if(!logged){
          this.presentErrorToast();

          this.loadingMessage = 'Ops, deu errado.';
          this.isLoading = false;

          return of(false);
        }

        if (autoLogin) {
          this.isLoading = true;
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
