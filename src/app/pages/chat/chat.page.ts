import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonButtons, NavController } from '@ionic/angular/standalone';
import { Subscription, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

    console.log('Inicou');


    this.timerSubscription = timer(0, 1000).subscribe(() => {
      //console.log('tick from:', jid);
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();

    console.log('Destruiu');
  }

}
