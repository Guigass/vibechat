import { RosterRepository } from 'src/app/shared/repositories/roster/roster.repository';
import { Component, OnInit, inject, input } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { RosterGroupComponent } from '../roster-group/roster-group.component';
import { IonContent, IonSearchbar, IonList } from "@ionic/angular/standalone";
import { take } from 'rxjs';
import { ContactRepository } from '../../repositories/contact/contact.repository';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  standalone: true,
  imports: [IonList,
    IonSearchbar,
    IonContent,
    CommonModule,
    RosterGroupComponent
  ],
})
export class RosterComponent {
  public rosterRepository = inject(RosterRepository);
  public contactResposioty = inject(ContactRepository);
}
