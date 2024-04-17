import { PresenceService } from 'src/app/shared/services/presence/presence.service';
import { ContactRepository } from './../../repositories/contact/contact.repository';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { ContactGroupModel } from '../../models/contact-group.model';
import { RosterContactItemComponent } from '../../components/roster-contact-item/roster-contact-item.component';
import { IonAccordionGroup, IonAccordion, IonLabel, IonItem, IonList } from "@ionic/angular/standalone";
import { ContactModel } from '../../models/contact.model';
import { BehaviorSubject, map, distinctUntilChanged, from, switchMap, catchError, of, tap, concatMap, filter } from 'rxjs';
import { PresenceType } from '../../enums/presence-type.enum';
import { PresenceModel } from '../../models/presence.model';

@Component({
  selector: 'app-roster-group',
  templateUrl: './roster-group.component.html',
  styleUrls: ['./roster-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, CommonModule, RosterContactItemComponent],
})
export class RosterGroupComponent implements OnInit, OnChanges {
  @Input() rosterGroup?: ContactGroupModel;
  @Input() index?: number;
  @Input() open?: boolean = false;
  @Input() search?: string;

  private contactRepository = inject(ContactRepository);
  private presenceService = inject(PresenceService);

  private contactPresences: Map<string, PresenceModel | undefined> = new Map();

  isSearching: boolean = false;
  groupHidden: boolean = false;


  ngOnInit(): void {
    this.initializeAndWatchPresences();
  }

  initializeAndWatchPresences() {
    if (!this.rosterGroup?.contacts) {
      return;
    }
  
    // Carrega as presenças iniciais
    from(this.rosterGroup.contacts).pipe(
      concatMap(contact => 
        this.contactRepository.getContactPresence(contact.jid).pipe(
          catchError(() => of({ jid: contact.jid, type: PresenceType.Offline })), 
          tap(presence => this.contactPresences.set(contact.jid, presence))
        )
      ),
    ).subscribe(() => {
      this.sortContacts();
    });

    this.presenceService.getPresences().pipe(
      filter(presence => presence && this.rosterGroup?.contacts.some(s => s.jid === presence.jid) ? true : false),
      tap(presence => this.contactPresences.set(presence.jid, presence))
    ).subscribe(() => {
      this.sortContacts();
    })
  }

  sortContacts() {
    const sortedContacts = this.rosterGroup!.contacts.sort((a, b) => {
      const aPresence = this.contactPresences.get(a.jid)?.type || 'offline';
      const bPresence = this.contactPresences.get(b.jid)?.type || 'offline';
      return this.getPresenceWeight(aPresence) - this.getPresenceWeight(bPresence);
    });

    this.rosterGroup!.contacts = sortedContacts;
  }
  
  getPresenceWeight(presenceType: string): number {
    switch (presenceType) {
      case 'online': return 1;
      case 'away': return 2;
      default: return 3;  // 'offline'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['search']) {
      if (changes['search'].firstChange === false && changes['search'].currentValue !== '') {

        const searchResult = this.rosterGroup?.contacts.filter(contact => contact.name.toLowerCase().includes(changes['search'].currentValue.toLowerCase()));
        this.open = searchResult && searchResult.length > 0;
  
        this.isSearching = true;
  
        this.rosterGroup?.contacts.forEach(contact => {
          if (searchResult?.findIndex(search => search.jid === contact.jid) === -1) {
            contact.hidden = true;
          } else {
            contact.hidden = false;
          }
        });
  
        this.groupHidden = this.rosterGroup?.contacts.filter(contact => contact.hidden === false).length === 0;
      } else {
        this.rosterGroup?.contacts.forEach(contact => {
          contact.hidden = false;
        });
  
        this.groupHidden = false;
        this.open = false;
        this.isSearching = false;
      }
    }
  }

  trackBy(index: number, item: ContactModel) {
    return item.jid;
  }
}
