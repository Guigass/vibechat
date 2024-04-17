import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, ReplaySubject, distinctUntilChanged, filter, mergeMap, share, take, timer } from 'rxjs';
import { RosterService } from '../../services/roster/roster.service';
import { DatabaseService } from '../../services/database/database.service';
import { ContactGroupModel } from '../../models/contact-group.model';
import { ContactModel } from '../../models/contact.model';
import { Database2Service } from '../../services/database/database2.service';
import { PresenceType } from '../../enums/presence-type.enum';

@Injectable({
  providedIn: 'root'
})
export class RosterRepository {
  //private db = inject(DatabaseService);
  private db = inject(Database2Service);

  private rosterService = inject(RosterService);
  private ngZone = inject(NgZone);

  private rosterList$: ReplaySubject<ContactModel[]> = new ReplaySubject<ContactModel[]>();
  public rosterList = this.rosterList$.asObservable().pipe(share());

  constructor() {
    this.db.dbReady.pipe(filter(ready => ready)).subscribe(() => {
      this.init();
    });
  }

  private init() {
    this.ngZone.runOutsideAngular(() => {
      this.db.contacts.toArray().then((contacts) => {
        if (contacts.length > 0) {
          this.rosterList$.next(contacts);
        } 

        this.getRosterList();
        this.watchForRosterUpdates();
      });
    });
  }

  private getRosterList() {
    this.ngZone.runOutsideAngular(() => {
      this.rosterService.getRosterList().pipe(
        take(1),
        distinctUntilChanged()
      ).subscribe((contacts) => {
        contacts.forEach((contact) => {
          this.db.contacts.where('jid').equals(contact.jid).first().then(async (existContact) => {
            if (!existContact) {
              await this.db.contacts.add(contact);
              await this.db.presences.add({ jid: contact.jid, type: PresenceType.Offline, status: '' });
              await this.db.contactsInfo.add({ jid: contact.jid, fullname: contact.name, nickname: '', email: '', phone: '', givenName: '', familyName: '', avatar: '' });
            }
          });
        })

        this.rosterList$.next(contacts);
      });

      this.rosterService.requestRoster().pipe(take(1)).subscribe();
    });
  }

  private watchForRosterUpdates() {
    this.ngZone.runOutsideAngular(() => {
      this.rosterService.getRosterUpdate()
        .subscribe((contact) => {
          if (contact.subscription !== 'both') {
            this.db.contacts.where('jid').equals(contact.jid).first().then(async (existContact) => {
              if (existContact) {
                await this.db.contacts.delete(existContact.id!);
                await this.db.presences.where('jid').equals(contact.jid).delete();
                await this.db.contactsInfo.where('jid').equals(contact.jid).delete();
              }
            });
          } else {
            this.db.contacts.where('jid').equals(contact.jid).first().then(async (existContact) => {
              if (existContact) {
                await this.db.contacts.update(existContact.id!, { ...contact });
              } else {
                await this.db.contacts.add(contact);
                await this.db.presences.add({ jid: contact.jid, type: PresenceType.Offline, status: '' });
                await this.db.contactsInfo.add({ jid: contact.jid, fullname: contact.name, nickname: '', email: '', phone: '', givenName: '', familyName: '', avatar: '' });
              }
            });
          }

          this.db.contacts.toArray().then((contacts) => {
            this.rosterList$.next(contacts);
          });
        });
    });
  }
}
