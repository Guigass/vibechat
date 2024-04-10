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

  public usuarios = true;

  constructor() { }

  ngOnInit() {

    console.log(this.usuarios);
  }

}
