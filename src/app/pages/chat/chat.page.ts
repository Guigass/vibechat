import { SharingService } from './../../shared/services/sharing/sharing.service';
import { ContactRepository } from './../../shared/repositories/contact/contact.repository';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
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
import { Subscription, mergeMap, timer } from 'rxjs';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ngfModule } from 'angular-file';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { v4 as uuidv4 } from 'uuid';
import { SortPipe } from 'src/app/shared/pipes/sort/sort.pipe';
import { VCardModel } from 'src/app/shared/models/vcard.model';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';


@Component({
  selector: 'app-chat-page',
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
    ChatComponent
  ],
})
export class ChatPage implements OnInit {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private contactRepository = inject(ContactRepository);
  private chatRepository = inject(ChatRepository);
  private sharingService = inject(SharingService);

  @ViewChild('txtaMsg') txtaMsg!: IonTextarea;
  @ViewChild('virtualScroll') viewport!: CdkVirtualScrollViewport;
  
  jid = signal('');
  contact = signal<ContactModel | undefined>(undefined);
  contactInfo = signal<VCardModel | undefined>(undefined);

  file: any;
  emoji: any;
  showEmoji = false;

  constructor() {
    this.navCtrl.setDirection('root');

    addIcons({
      send,
      happyOutline,
      folderOutline,
    });

  }

  ngOnInit() {
    const jidquery = this.route.snapshot.paramMap.get('jid');
    if (jidquery) {
      this.jid.set(jidquery);
    }

    this.contactRepository.getContact(this.jid()).pipe(
      mergeMap((contact) => {
        this.contact.set(contact);

        return this.contactRepository.getContactInfo(this.jid())
      })
    )
    .subscribe((contactInfo) => {
      this.contactInfo.set(contactInfo);
    });
  }

  sendMessage(msg: any) {
    if (!msg || msg.value === '') {
      return;
    }

    this.chatRepository.sendMessage(msg.value, this.jid()).subscribe(() => {
      msg.value = '';
      msg.setFocus();
    });
  }

  addEmoji(evnt: any) {
    this.txtaMsg.value += evnt.emoji.native;
  }

  sendFile(evt: any) {

    this.file = evt;

    if (this.file && !this.file.id) {
      this.sharingService
        .shareFile(this.file, uuidv4())
        .subscribe((resp) => {
          console.log('Ola', resp);
        });

    }
  }

  openEmoji() {
    this.showEmoji = this.showEmoji ? false : true;
  }
}
