import { SharingService } from './../../shared/services/sharing/sharing.service';
import { ContactRepository } from './../../shared/repositories/contact/contact.repository';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ngfModule, ngf, ngfDrop } from 'angular-file';

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
    AvatarComponent,
    PickerComponent,
    ngfModule,
  ],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('txtaMsg') txtaMsg!: IonTextarea;
  mensages!: MessageModel[];
  jid!: string;
  contact!: ContactModel | null;

  public file: any;
  public emoji: any;
  public showPreview = false;
  private lastUsedId: number = 1;
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private chatRepository = inject(ChatRepository);
  private contactRepository = inject(ContactRepository);
  private sharingService = inject(SharingService);

  private typingSubject = new Subject<void>();
  private isTyping = false;

  messagesSubscription!: Subscription;

  private messag!: MessageModel;

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
      this.contact = contact!;
      console.log(this.contact);
    });

    this.typingSubject.pipe(debounceTime(1000)).subscribe((searchValue) => {
      if (this.isTyping && this.contact) {
        //this.chatRepository.sendTypingState(this.contact?.jid, false).subscribe();
      }

      this.isTyping = false;
    });

    this.chatRepository.loadMessagesFromServer(this.jid, 10);

    // this.messagesSubscription = this.chatRepository.messages.pipe(
    //   filter((message) => message != null),
    //   filter((message) => message?.from === this.contact?.jid || message?.to === this.contact?.jid)
    // ).subscribe((message) => {
    //   console.log('message', message);
    //   this.mensages.push(message!);
    // });

    // this.chatRepository.getSetMessagesAsRead(this.jid).pipe(take(1))
    // .subscribe((messages) => {
    //   this.mensages = messages;
    // });

    // this.chatRepository.requestMessagesHistory(this.jid, 10, '');
  }

  sendMessage(msg: any) {
    if (!msg || msg.value === '') {
      return;
    }

    //this.chatRepository.sendMessage(msg.value, this.jid).subscribe(() => {
    //  msg.value = '';
    //  msg.setFocus();
    //});
  }

  typing(event: any) {
    if (!this.isTyping && this.contact) {
      //this.chatRepository.sendTypingState(this.contact?.jid, true).subscribe();
    }

    this.isTyping = true;
    this.typingSubject.next();
  }

  ngOnDestroy(): void {
    this.typingSubject.complete();
    this.messagesSubscription?.unsubscribe();
  }

  addEmoji(evnt: any) {
    this.txtaMsg.value += evnt.emoji.native;
  }
  sendFile(evt: any) {

    this.file = evt;
    let id = this.lastUsedId;
    this.lastUsedId++;

    if (this.file && !this.file.id) {
      this.file.id = id;

      this.sharingService
        .shareFile(this.file, this.lastUsedId.toString())
        .subscribe((resp) => {
          console.log('Ola', resp);
        });

    }
  }

  openEmoji() {
    this.showPreview = this.showPreview ? false : true;
  }
}
