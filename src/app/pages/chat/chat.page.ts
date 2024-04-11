import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonButtons, NavController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, IonButton]
})
export class ChatPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);

  timerSubscription!: Subscription;

  constructor() {
    this.navCtrl.setDirection('root');
  }

  ngOnInit() {
    let jid = this.route.snapshot.paramMap.get('jid');
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
