import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonSearchbar, IonFooter, IonItem, IonApp } from "@ionic/angular/standalone";
import { RosterComponent } from '../roster/roster.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  standalone: true,
  imports: [IonApp, IonItem, IonFooter, 
    IonSearchbar,
    IonToolbar,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonContent,
    IonHeader,
    CommonModule,
    RosterComponent
  ],
})
export class AsideComponent {

  public view : string = 'usuarios';

  constructor() {}

  changeView(evt: any) {
    this.view = evt.detail.value;
  }
}
