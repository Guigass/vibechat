import { VcardService } from './../../services/vcard/vcard.service';
import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Observable, ObservableInput, ReplaySubject, concat, concatMap, debounce, debounceTime, filter, forkJoin, map, of, switchMap, take, tap, timer } from 'rxjs';
import { DatabaseService } from '../../services/database/database.service';
import { RosterRepository } from '../roster/roster.repository';
import { PresenceService } from 'src/app/shared/services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { Database2Service } from '../../services/database/database2.service';

@Injectable({
  providedIn: 'root'
})
export class ContactRepository {
  private db = inject(Database2Service);
  private rosterRepository = inject(RosterRepository);
  private presenceService = inject(PresenceService);
  private vcardService = inject(VcardService);
  private ngZone = inject(NgZone);

  private contactUpdate$: BehaviorSubject<ContactModel | null> = new BehaviorSubject<ContactModel | null>(null);
  public contactUpdate = this.contactUpdate$.asObservable();

  private presenceUpdate$: ReplaySubject<PresenceModel | null> = new ReplaySubject<PresenceModel | null>();
  public presenceUpdate = this.presenceUpdate$.asObservable();

  constructor() {
    this.init();
  }

  public getContact(jid: string): Observable<ContactModel | null> {
    return of()

    // console.log(`c_${jid}`);
    // return this.db.getData(`c_${jid}`);
  }

  public updateContact(contact: ContactModel): Observable<ContactModel> {
    return of()
    // return this.db.addData(`c_${contact.jid}`, contact).pipe(tap(() => {
    //   this.contactUpdate$.next(contact);
    // }));
  }

  private init() {
    this.updateUsersInfo();


    // this.watchForPresenceUpdates();
    // this.updateContacts();
  }

  private updateUsersInfo() {
    this.rosterRepository.rosterList.pipe(take(1))
      .subscribe(contacts => {
        contacts.forEach(contact => {
          this.vcardService.getVCard(contact.jid).subscribe((vcard) => {
            this.db.contactsInfo.where('jid').equals(contact.jid).first().then(async (contactInfo) => {
              if (contactInfo) {
                await this.db.contactsInfo.update(contactInfo.id!, {...vcard});
              } else {
                await this.db.contactsInfo.add(vcard);
              }
            });
          });
        });
      });
  }

  private watchForPresenceUpdates() {
    this.presenceService.getPresences().subscribe((presence) => {
      this.presenceUpdate$.next(presence);
    });
  }

  private updateContacts() {
    // this.rosterRepository.rosterList.subscribe(roster => {
    //   roster.forEach(group => {
    //     group.contacts.forEach(contact => {
    //       this.db.getData(`c_${contact.jid}`).subscribe((contactData: ContactModel) => {
    //         if (contactData) {
    //           contactData.name = contact.name;
    //           contactData.jid = contact.jid;
    //           contactData.subscription = contact.subscription;
    //           contactData.groups = contact.groups;
    //           this.db.addData(`c_${contact.jid}`, contactData).subscribe();
    //         } else {
    //           this.db.addData(`c_${contact.jid}`, contact).subscribe();
    //         }
    //       });
    //     });
    //   });
    // });
  }

  private updateContactPresence(presence: PresenceModel): Observable<ContactModel> {
    return of()

    // if (!presence.jid) {
    //   return new Observable();
    // }

    // return this.db.getData(`c_${presence.jid}`).pipe(
    //   map(contact => {
    //     if (contact) {
    //       contact.presence = presence;
    //     } else {
    //       contact = {
    //         jid: presence.jid,
    //         name: presence.jid,
    //         presence: presence,
    //         groups: []
    //       };
    //     }

    //     return contact;
    //   }),
    //   switchMap(contact => {
    //     if (!contact) {
    //       return of();
    //     }

    //     return this.db.addData(`c_${contact.jid}`, contact)
    //   }),
    //   tap((contact) => {
    //     this.contactUpdate$.next(contact);
    //   })
    // );
  }

}
