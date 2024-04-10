import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonSearchbar } from "@ionic/angular/standalone";
import { RosterGroupComponent } from '../roster-group/roster-group.component';
import { RosterUserItemComponent } from '../roster-user-item/roster-user-item.component';

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
    RosterGroupComponent,
    RosterUserItemComponent
  ],
})
export class AsideComponent  implements OnInit {

  public usuarios = true;

  constructor() { }

  ngOnInit() {

    console.log(this.usuarios);
  }

}
