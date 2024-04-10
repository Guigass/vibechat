import { Component, OnInit, inject, input } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { RosterGroupComponent } from '../roster-group/roster-group.component';
import { IonContent, IonSearchbar } from "@ionic/angular/standalone";
import { take } from 'rxjs';

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
    this.rosterService.getRosterList()
    .pipe(take(1))
    .subscribe((contactsGroups) => {
      this.groups = contactsGroups;
    });

    this.rosterService.getTosterUpdate()
    .subscribe((contact) => {
      //Caso o subscription do contato seja diferente de 'both' remove da lista
      if (contact.subscription !== 'both') {
        this.groups.forEach((group) => {
          group.contacts = group.contacts.filter((c: any) => c.jid !== contact.jid);

          //Caso o grupo esteja vazio remove o grupo da lista
          if (group.contacts.length === 0) {
            this.groups = this.groups.filter((g) => g.name !== group.name);
          }
        });
      } else {
        contact.groups.forEach((userGroup: any) => {
          //Caso o contato não esteja na lista, adiciona
          let group = this.groups.find((g) => g.name === userGroup);
          if (!group) {
            group = { name: userGroup, contacts: [contact] };
            this.groups.push(group);
          } else {
            if (!group.contacts.find((c: any) => c.jid === contact.jid)) {
              group.contacts.push(contact);
            }
          }
        });
      }
    });

    this.rosterService.requestRoster().subscribe();
  }
}
