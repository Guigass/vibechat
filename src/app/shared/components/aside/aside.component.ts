import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, signal } from '@angular/core';
import { IonHeader, IonContent, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonSearchbar, IonFooter, IonItem, IonApp } from "@ionic/angular/standalone";
import { RosterComponent } from '../roster/roster.component';

@Component({
  
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonApp, 
    IonItem, 
    IonFooter, 
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
  public view = signal('usuarios');

  constructor() {}

  changeView(evt: any) {
    this.view.set(evt.detail.value);
  }
}
