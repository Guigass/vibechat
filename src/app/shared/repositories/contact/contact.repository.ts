import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Observable, ObservableInput, concat, concatMap, debounce, debounceTime, filter, forkJoin, map, of, switchMap, tap, timer } from 'rxjs';
import { DatabaseService } from '../../services/database/database.service';
import { RosterRepository } from '../roster/roster.repository';
import { PresenceService } from 'src/app/shared/services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';

@Injectable({
  providedIn: 'root'
})
export class ContactRepository {
  private db = inject(DatabaseService);
  private rosterRepository = inject(RosterRepository);
  private presenceService = inject(PresenceService);
  private ngZone = inject(NgZone);

  private contactUpdate$: BehaviorSubject<ContactModel | null> = new BehaviorSubject<ContactModel | null>(null);
  public contactUpdate = this.contactUpdate$.asObservable();

  constructor() {
    this.init();
  }

  private init() {
    this.watchForPresenceUpdates();

    timer(0, 2000).subscribe(() => {
      this.updateContacts();
    })
  }

  private watchForPresenceUpdates() {
    this.presenceService.getPresences().subscribe((presence) => {
      this.updateContactPresence(presence).subscribe((contact) => {
        this.contactUpdate$.next(contact);
      });
    });
  }

  private updateContactPresence(presence: PresenceModel): Observable<ContactModel> {
    if (!presence.jid) {
      return new Observable();
    }

    return this.db.getData(`c_${presence.jid}`).pipe(
      map(contact => {
        if (contact) {
          contact.presence = presence;
        } else {
          contact = {
            jid: presence.jid,
            name: presence.jid,
            presence: presence,
            groups: []
          };
        }

        return contact;
      }),
      switchMap(contact => {
        if (!contact) {
          return of();
        }

        return this.db.addData(`c_${contact.jid}`, contact)
      })
    );
  }

  private updateContacts() {
    this.rosterRepository.rosterList.subscribe(roster => {
      roster.forEach(group => {
        group.contacts.forEach(contact => {
          this.db.getData(`c_${contact.jid}`).subscribe((contactData: ContactModel) => {
            if (contactData) {
              contactData.name = contact.name;
              contactData.jid = contact.jid;
              contactData.subscription = contact.subscription;
              contactData.groups = contact.groups;
              this.db.addData(`c_${contact.jid}`, contactData).subscribe();
            } else {
              this.db.addData(`c_${contact.jid}`, contact).subscribe();
            }
          });
        });
      });
    });
  }
}