import { VcardService } from './../../services/vcard/vcard.service';
import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, ObservableInput, ReplaySubject, catchError, concat, concatMap, debounce, debounceTime, defer, delay, filter, forkJoin, from, map, mergeMap, of, share, switchMap, take, tap, timer } from 'rxjs';
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

  constructor() {
    this.db.dbReady.pipe(filter(ready => ready)).subscribe(() => {
      this.init();
    });
  }

  public getContact(jid: string): Observable<any> {
    return this.db.contacts.$.where('jid').equals(jid).first();
  }

  public getContactInfo(jid: string): Observable<any> {
    return this.db.contactsInfo.$.where('jid').equals(jid).first();
  }

  public getContactPresence(jid: string): Observable<any> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      switchMap((ready) => {
        return this.db.presences.$.where('jid').equals(jid).first().pipe(share())
      })
    );
  }

  private init() {
    this.updateUsersInfo();
    this.watchForPresenceUpdates();
  }

  private updateUsersInfo() {
    this.ngZone.runOutsideAngular(() => {
      const umaSemanaAtras = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  
      this.rosterRepository.rosterList.pipe(
        take(1),
        concatMap(contacts => from(contacts)),
        concatMap(contact =>
          from(this.db.contactsInfo.where('jid').equals(contact.jid).first()).pipe(
            catchError(error => {
              return of(null);
            }),
            concatMap(contactInfo => {
              if (!contactInfo || !contactInfo.updatedAt || new Date(contactInfo.updatedAt) < umaSemanaAtras) {
                return this.vcardService.getVCard(contact.jid).pipe(
                  delay(1000),
                  map(vcard => ({ contact, vcard, contactInfo })),
                  catchError(error => {
                    return of();
                  })
                );
              } else {
                return of();
              }
            }),
            filter(result => result !== undefined)
          )
        ),
        filter(result => result !== undefined),
        concatMap(({ contact, vcard, contactInfo }) =>
          contactInfo ? 
            from(this.db.contactsInfo.update(contactInfo.id!, { ...vcard, updatedAt: new Date() })) :
            from(this.db.contactsInfo.add({ ...vcard, jid: contact.jid, updatedAt: new Date() }))
        ),
        catchError(error => {
          return of(null);
        })
      ).subscribe();
    });
  }

  private watchForPresenceUpdates() {
    this.ngZone.runOutsideAngular(() => {
      this.presenceService.getPresences().subscribe((presence) => {
        this.db.presences.where('jid').equals(presence.jid).first().then(async (presenceData) => {
          if (presenceData) {
            await this.db.presences.update(presenceData.id!, presence);
          } else {
            await this.db.presences.add(presence);
          }
        });
      });
    });
  }
}
