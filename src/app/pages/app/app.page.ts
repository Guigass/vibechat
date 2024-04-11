import { SplashScreenService } from './../../shared/services/splash-screen/splash-screen.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonFooter } from '@ionic/angular/standalone';
import { AsideComponent } from 'src/app/shared/components/aside/aside.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { XmppServicesService } from 'src/app/shared/services/xmpp-services/xmpp-services.service';
import { XmppService } from 'src/app/shared/services/xmpp/xmpp.service';
import { RosterRepository } from 'src/app/shared/repository/roster/roster.repository';

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

  private rosterRepository = inject(RosterRepository);

  constructor() {
    this.db.init().subscribe((ready) => {
      if (ready) {
        this.splashScreenService.hide();
      }
    });
  }

}
