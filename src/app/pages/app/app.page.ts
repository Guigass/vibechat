import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonMenu, IonRouterOutlet, IonTitle, IonToolbar, IonButtons, IonFooter, IonNav } from '@ionic/angular/standalone';
import { AsideComponent } from 'src/app/shared/components/aside/aside.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
  standalone: true,
  imports: [IonNav, IonFooter, IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonMenu,
    IonToolbar,
    CommonModule,
    FormsModule,
    AsideComponent,
    IonRouterOutlet,
    TabsComponent,
  ]
})
export class AppPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
