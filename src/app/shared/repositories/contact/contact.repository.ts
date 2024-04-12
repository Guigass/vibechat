import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Observable, ObservableInput, concat, concatMap, debounce, debounceTime, filter, forkJoin, switchMap, tap, timer } from 'rxjs';
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

  init() {
    this.updateContacts();
    this.watchForPresenceUpdates();
  }

  watchForPresenceUpdates() {
    this.presenceService.getPresences().subscribe((presence) => {
      this.updateContactPresence(presence).subscribe((contact) => {
        this.contactUpdate$.next(contact);
      });
    });
  }

  updateContactPresence(presence: PresenceModel): Observable<ContactModel> {
    return this.db.getData(`c_${presence.jid}`).pipe(
      tap(contact => contact.presence = presence),
      switchMap(contact => this.db.addData(`c_${contact.jid}`, contact))
    );
  }

  updateContacts() {
    this.rosterRepository.rosterList.subscribe(roster => {
      roster.forEach(group => {
        group.contacts.forEach(contact => {
          this.db.addData(`c_${contact.jid}`, contact).subscribe();
        });
      });
    });
  }
}