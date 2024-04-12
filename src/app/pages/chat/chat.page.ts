import { ContactRepository } from './../../shared/repositories/contact/contact.repository';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
  IonImg,
  IonAvatar,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { MessageModel } from 'src/app/shared/models/message.model';
import { MessageBubbleComponent } from 'src/app/shared/components/message-bubble/message-bubble.component';
import { addIcons } from 'ionicons';
import { send, happyOutline, folderOutline } from 'ionicons/icons';
import { ContactModel } from 'src/app/shared/models/contact.model';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { ChatRepository } from 'src/app/shared/repositories/chat/chat.repository';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonImg,
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
    AvatarComponent
  ],
})
export class ChatPage implements OnInit, OnDestroy {
  mensagens!: MessageModel;
  jid!: string;
  contact!: ContactModel | null;

  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private chatRepository = inject(ChatRepository);
  private contactRepository = inject(ContactRepository);

  private typingSubject = new Subject<void>();
  private isTyping = false;

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
    }
    
    this.contactRepository.getContact(this.jid).subscribe((contact) => {
      this.contact = contact;
    });

    this.getUserOutlineColor();

    this.typingSubject.pipe(debounceTime(1000)).subscribe((searchValue) => {
      if (this.isTyping && this.contact) {
        this.chatRepository.sendTypingState(this.contact?.jid, false).subscribe();
      }

      this.isTyping = false;
    });
  }

  getUserOutlineColor(): string {
    if (this.contact?.presence?.type === 'online') {
      return 'green';
    } else if (this.contact?.presence?.type === 'offline') {
      return 'red';
    } else {
      return 'yellow';
    }
  }
  sendMessage(msg: any) {
    if (!msg || msg.value === '') {
      return;
    }

    this.chatRepository.sendMessage(msg.value, this.jid).subscribe();
  }

  typing(event: any) {
    if (!this.isTyping && this.contact) {
      this.chatRepository.sendTypingState(this.contact?.jid, true).subscribe();
    }

    this.isTyping = true;
    this.typingSubject.next();
  }

  ngOnDestroy(): void {
    this.typingSubject.complete();
  }
}
