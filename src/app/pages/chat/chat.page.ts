import { SharingService } from './../../shared/services/sharing/sharing.service';
import { ContactRepository } from './../../shared/repositories/contact/contact.repository';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { Subscription, timer } from 'rxjs';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ngfModule } from 'angular-file';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { PageScrollService } from 'ngx-page-scroll-core';

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
    ScrollingModule
  ],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('txtaMsg') txtaMsg!: IonTextarea;
  @ViewChild('virtualScroll') viewport!: CdkVirtualScrollViewport;
  
  messages = signal<MessageModel[]>([]);

  jid = signal('');
  
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

  messagesHistorySubscription!: Subscription;
  messagesSubscription!: Subscription;

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
      this.jid.set(jidquery);
    }

    this.contactRepository.getContact(this.jid()).subscribe((contact) => {
      this.contact = contact!;
    });

    this.messagesSubscription = this.chatRepository.getNewMessages(this.jid()).subscribe((message) => {
      this.messages.update((values) => {
        return [...values, message];
      })

      this.chatScroll();
    });

    this.messagesHistorySubscription = this.chatRepository.loadMessages(this.jid(), 10).subscribe((messages) => {
      console.log('Messages', messages);
      // this.messages.set(messages);

      //this.chatScroll();
    }, (err) => {
      console.log('Error', err);

    }, () => {
      

    });
  }

  getMessageHistory() {

  }

  sendMessage(msg: any) {
    if (!msg || msg.value === '') {
      return;
    }

    this.chatRepository.sendMessage(msg.value, this.jid()).subscribe(() => {
      msg.value = '';
      msg.setFocus();

      this.chatScroll();
    });
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

  chatScroll(){
    timer(250).subscribe(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'smooth',
      });
    });
  }

  ngOnDestroy(): void {
    this.messagesHistorySubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
  }
}
