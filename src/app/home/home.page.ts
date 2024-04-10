import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { XmppService } from '../shared/services/xmpp/xmpp.service';
import { ChatService } from '../shared/services/chat/chat.service';
import { timer } from 'rxjs';
import { MessageModel } from '../shared/models/message.model';
import { RosterService } from '../shared/services/roster/roster.service';
import { PresenceService } from '../shared/services/presence/presence.service';
import { PresenceType } from '../shared/enums/presence-type.enum';
import { NotificationService } from '../shared/services/notification/notification.service';
import { StorageService } from '../shared/services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {

  constructor() {
  }
}
