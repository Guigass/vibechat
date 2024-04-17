import { VcardService } from './../../services/vcard/vcard.service';
import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, ObservableInput, ReplaySubject, catchError, concat, concatMap, debounce, debounceTime, defer, delay, filter, forkJoin, from, map, mergeMap, of, share, switchMap, take, tap, timer } from 'rxjs';
import { DatabaseService } from '../../services/database/database.service';
import { RosterRepository } from '../roster/roster.repository';
import { PresenceService } from 'src/app/shared/services/presence/presence.service';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { Database2Service } from '../../services/database/database2.service';
import { VCardModel } from '../../models/vcard.model';

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

  public getContact(jid: string): Observable<ContactModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      take(1),
      switchMap(() => defer(() => from(this.db.contacts.$.where('jid').equals(jid).first()))),
    );
  }

  public getContactChanges(jid: string): Observable<ContactModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      switchMap((ready) => {
        return this.db.contacts.$.where('jid').equals(jid).first();
      }),
      share()
    );
  }

  public getContactInfo(jid: string): Observable<VCardModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      take(1),
      switchMap(() => defer(() => from(this.db.contactsInfo.$.where('jid').equals(jid).first()))),
    );
  }

  public getContactInfoChanges(jid: string): Observable<VCardModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      switchMap((ready) => {
        return this.db.contactsInfo.$.where('jid').equals(jid).first();
      }),
      share()
    );
  }

  public getContactPresence(jid: string): Observable<PresenceModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      take(1),
      switchMap(() => defer(() => from(this.db.presences.where('jid').equals(jid).first()))),
    );
  }

  public getContactPresenceChanges(jid: string): Observable<PresenceModel | undefined> {
    return this.db.dbReady.pipe(
      filter(ready => ready),
      switchMap((ready) => {
        return this.db.presences.$.where('jid').equals(jid).first();
      }),
      share()
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
                  delay(250),
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
      this.db.presences.$.toArray().pipe(
        switchMap(presences =>
          Promise.all(presences.map(presence => this.db.presences.update(presence.id!, { status: 'offline', show: 'offline' })))
        ),
        switchMap(() => this.presenceService.getPresences()),
        switchMap(presence =>
          from(this.db.presences.where('jid').equals(presence.jid).first()).pipe(
            switchMap(presenceData =>
              presenceData ?
                from(this.db.presences.update(presenceData.id!, presence)) :
                from(this.db.presences.add(presence))
            ),
            switchMap(() => this.updateVCardIfNeeded(presence.jid))
          )
        )
      ).subscribe();
    });
  }

  private updateVCardIfNeeded(jid: string) {
    return from(this.db.contactsInfo.where('jid').equals(jid).first()).pipe(
      switchMap(contactInfo => {
        return this.vcardService.getVCard(jid).pipe(
          switchMap(vcard => contactInfo ?
            this.db.contactsInfo.update(contactInfo.id!, { ...vcard, updatedAt: new Date() }) :
            this.db.contactsInfo.add({ ...vcard, jid, updatedAt: new Date() })
          )
        );
      }),
      catchError(err => {
        return from([null]);
      })
    );
  }
}
