import { AfterViewInit, Component, NgZone, OnInit, Signal, computed, inject, input, signal } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { ChatRepository } from '../../repositories/chat/chat.repository';
import { MessageModel } from '../../models/message.model';
import { SortOnlinePipe } from '../../pipes/sort-online/sort-online.pipe';
import { SortPipe } from '../../pipes/sort/sort.pipe';
import { ContactModel } from '../../models/contact.model';
import { VCardModel } from '../../models/vcard.model';
import { timer } from 'rxjs';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { ImageBubbleComponent } from '../image-bubble/image-bubble.component';
import { AudioBubbleComponent } from '../audio-bubble/audio-bubble.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  providers: [SortPipe],
  imports: [ CommonModule,MessageBubbleComponent, ImageBubbleComponent, AudioBubbleComponent]
})
export class ChatComponent  implements OnInit {
  contact = input<ContactModel>();
  contactInfo = input<VCardModel>();

  private ngZone = inject(NgZone);
  private chatRepository = inject(ChatRepository);
  private sortPipe = inject(SortPipe);

  messages = signal<MessageModel[]>([]);
  messagesList: Signal<MessageModel[]>;

  //Pagination Info
  take = 40;
  skip = 0;
  total = 0;


  constructor() {
    this.messagesList = computed(() => {
      return this.sortPipe.transform(this.messages(), 'asc', 'timestamp');
    });
  }

  ngOnInit() {
    this.loadLocalHistory();
    this.watchforNewMessages();
    this.syncServerMessages();
  }

  watchforNewMessages() {
    this.chatRepository.getNewMessages(this.contact()?.jid!).subscribe((message) => {
      this.messages.update(() => {
        return [...this.messages(), message];
      });

    });
  }

  loadLocalHistory() {
    this.chatRepository.getMessages(this.contact()!.jid, this.take, this.skip).subscribe((messages) => {
      this.messages.update(() => {
        return [...this.messages(), ...messages];
      });
    });
  }

  loadMore() {
    this.skip += this.take;
    this.loadLocalHistory();
  }

  syncServerMessages(){
    this.ngZone.runOutsideAngular(() => {
      this.chatRepository.syncServerMessages(this.contact()?.jid!).subscribe({
        next: (message) => {
        },
        error: (error) => {
        },
        complete: () => {
          this.loadLocalHistory();
        }
      });
    });
  }
}
