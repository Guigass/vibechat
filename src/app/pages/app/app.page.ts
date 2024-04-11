import { SplashScreenService } from './../../shared/services/splash-screen/splash-screen.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonFooter } from '@ionic/angular/standalone';
import { AsideComponent } from 'src/app/shared/components/aside/aside.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';
import { DatabaseService } from 'src/app/shared/services/database/database.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { XmppServicesService } from 'src/app/shared/services/xmpp-services/xmpp-services.service';

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
  private xmppServicesService = inject(XmppServicesService);

  private chatService = inject(ChatService);

  constructor() {
    this.db.init().subscribe((ready) => {
      if (ready) {
        this.splashScreenService.hide();

        this.chatService.onMessageFromUser('cirion.teste@openfire.exclusivasex.com.br').subscribe((message) => {
          console.log('Mensagem recebida:', message);
        });

        this.chatService.sendMessage('Olá, tudo bem?', 'cirion.teste@openfire.exclusivasex.com.br').subscribe(() => {
          this.chatService.requestMessagesHistory('cirion.teste@openfire.exclusivasex.com.br', 20).subscribe();
        });

        this.chatService.getMessagesHistory('cirion.teste@openfire.exclusivasex.com.br').subscribe((messages) => {
          console.log('Histórico de mensagens:', messages);
        });

       this.xmppServicesService.services$.subscribe((services) => {
        console.log('Serviços descobertos:', services);
       })

      }
    });
  }

}
