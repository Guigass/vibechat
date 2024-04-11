import { RosterService } from './../../shared/services/roster/roster.service';
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  NavController,
  IonTextarea,
  IonFooter,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageModel } from 'src/app/shared/models/message.model';
import { MessageBubbleComponent } from 'src/app/shared/components/message-bubble/message-bubble.component';
import { addIcons } from 'ionicons';
import { send, happyOutline, folderOutline } from 'ionicons/icons';
import { PresenceModel } from 'src/app/shared/models/presence.model';
import { PresenceService } from 'src/app/shared/services/presence/presence.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonItem,
    IonFooter,
    IonTextarea,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonMenuButton,
    IonButton,
    MessageBubbleComponent,
  ],
})
export class ChatPage implements OnInit, OnDestroy {

  mensagens!: MessageModel;
  jid!: string ;
  user!: PresenceModel

  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private chatService = inject(ChatService);
  private rosterService = inject(RosterService);
  private presenceSubscription = inject(PresenceService);

  constructor() {
    addIcons({
      send,
      happyOutline,
      folderOutline,
    });
    this.navCtrl.setDirection('root');
  }

  ngOnInit() {
    const jidquery = this.route.snapshot.paramMap.get('jid');
    if (jidquery) {
      this.jid = jidquery;
      this.chatService.getMessagesHistory(this.jid).subscribe((messages) => {
        this.mensagens = messages;
      });
      this.chatService.requestMessagesHistory(this.jid, 10).subscribe();
    }

  }

  sendMessage(msg: any) {
    if (!msg) {
      return;
    }
    this.chatService.sendMessage(msg.value, this.jid).subscribe();

  }


  ngOnDestroy(): void {}
}
