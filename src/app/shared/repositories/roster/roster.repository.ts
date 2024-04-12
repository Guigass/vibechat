import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, ReplaySubject, mergeMap, take } from 'rxjs';
import { RosterService } from '../../services/roster/roster.service';
import { DatabaseService } from '../../services/database/database.service';
import { ContactGroupModel } from '../../models/contact-group.model';
import { ContactModel } from '../../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class RosterRepository {
  private db = inject(DatabaseService);
  private rosterService = inject(RosterService);

  private rosterList$: BehaviorSubject<ContactGroupModel[]> = new BehaviorSubject<ContactGroupModel[]>([]);
  public rosterList = this.rosterList$.asObservable();

  constructor() {
    this.init();
  }

  private init() {
    this.db.getData('roster').subscribe((rosterList) => {
      this.rosterList$.next(rosterList);
    });

    this.updateRosterList();
  }

  private updateRosterList(){
    this.rosterService.requestRoster().subscribe();

    this.rosterService.getRosterList()
    .pipe(take(1))
    .subscribe((contactsGroups) => {
      this.db.addData('roster', contactsGroups).subscribe((resp) => {
        this.rosterList$.next(contactsGroups);
      });

    });

    this.rosterService.getTosterUpdate()
    .subscribe((contact) => {
      let contactsGroups = this.rosterList$.value;

      //Caso o subscription do contato seja diferente de 'both' remove da lista
      if (contact.subscription !== 'both') {
        contactsGroups.forEach((group: ContactGroupModel) => {
          group.contacts = group.contacts.filter((c: ContactModel) => c.jid !== contact.jid);

          //Caso o grupo esteja vazio remove o grupo da lista
          if (group.contacts.length === 0) {
            contactsGroups = contactsGroups.filter((g: ContactGroupModel) => g.name !== group.name);
          }
        });
      } else {
        contact.groups.forEach((userGroup: string) => {
          //Caso o contato não esteja na lista, adiciona
          let group = contactsGroups.find((g: ContactGroupModel) => g.name === userGroup);
          if (!group) {
            if(userGroup){
              group = { name: userGroup, contacts: [contact] };
              contactsGroups.push(group);
            }
          } else {
            if (!group.contacts.find((c: ContactModel) => c.jid === contact.jid)) {
              group.contacts.push(contact);
            }
          }
        });
      }

      this.db.addData('roster', contactsGroups).subscribe((resp) => {
        this.rosterList$.next(contactsGroups);
      });
    });
  }
}
