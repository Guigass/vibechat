import { SplashScreenService } from './../../shared/services/splash-screen/splash-screen.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonFooter, IonItem, IonImg } from '@ionic/angular/standalone';
import { AsideComponent } from 'src/app/shared/components/aside/aside.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';
import { debounceTime, filter } from 'rxjs';
import { Database2Service } from 'src/app/shared/services/database/database2.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
  standalone: true,
  imports: [IonImg, IonItem, IonTitle, IonToolbar, IonHeader,
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
  private db = inject(Database2Service);
  private splashScreenService = inject(SplashScreenService);

  constructor() {
    this.db.dbReady.pipe(
      filter(ready => ready),
      debounceTime(1150)
    ).subscribe(() => {
      this.splashScreenService.hide();
    });
  }

}
