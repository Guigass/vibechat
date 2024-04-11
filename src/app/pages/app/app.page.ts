import { SplashScreenService } from './../../shared/services/splash-screen/splash-screen.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonFooter } from '@ionic/angular/standalone';
import { AsideComponent } from 'src/app/shared/components/aside/aside.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';
import { timer } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database/database.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, 
    CommonModule, 
    IonApp, 
    IonSplitPane, 
    IonMenu, 
    IonContent, 
    IonRouterOutlet,
    AsideComponent,
    TabsComponent,
    IonFooter
  ],
})
export class AppPage {
  private db = inject(DatabaseService);
  private splashScreenService = inject(SplashScreenService);

  constructor() {
    this.db.init().subscribe((ready) => {
      if (ready) {
        this.splashScreenService.hide();
      }
    });
  }

}
