import { Component, OnInit, inject, input } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { RosterGroupComponent } from '../roster-group/roster-group.component';
import { IonContent, IonSearchbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonContent,
    CommonModule,
    RosterGroupComponent
  ],
})
export class RosterComponent implements OnInit {

  private rosterService = inject(RosterService);

  groups: any[] = [];

  ngOnInit() {
    this.rosterService.getRoster().subscribe((contactsGroups) => {
      this.groups = contactsGroups;

      console.log(contactsGroups);
    });

    this.rosterService.requestRoster().subscribe();
  }
}
