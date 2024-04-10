import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonSearchbar } from "@ionic/angular/standalone";
import { RosterComponent } from '../roster/roster.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  standalone: true,
  imports: [
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
export class AsideComponent  implements OnInit {

  public view : string = 'usuarios';

  constructor() { }

  ngOnInit() {
    console.log(this.view);
  }

  changeView(evt: any) {
    this.view = evt.detail.value;
  }
}
