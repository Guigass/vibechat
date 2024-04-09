import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { XmppService } from '../shared/services/xmpp/xmpp.service';
import { ChatService } from '../shared/services/chat/chat.service';
import { timer } from 'rxjs';
import { MessageModel } from '../shared/models/message.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {

  constructor(private xmppService: XmppService, private chatService: ChatService) {

  }
}
