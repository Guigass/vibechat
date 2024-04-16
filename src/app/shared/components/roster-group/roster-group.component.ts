import { ContactRepository } from './../../repositories/contact/contact.repository';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { ContactGroupModel } from '../../models/contact-group.model';
import { RosterContactItemComponent } from '../../components/roster-contact-item/roster-contact-item.component';
import { IonAccordionGroup, IonAccordion, IonLabel, IonItem, IonList } from "@ionic/angular/standalone";
import { SortOnlinePipe } from '../../pipes/sort-online/sort-online.pipe';
import { filter } from 'rxjs';

@Component({
  selector: 'app-roster-group',
  templateUrl: './roster-group.component.html',
  styleUrls: ['./roster-group.component.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, CommonModule, RosterContactItemComponent, SortOnlinePipe],
})
export class RosterGroupComponent implements OnInit, OnChanges {
  @Input() rosterGroup?: ContactGroupModel;
  @Input() index?: number;
  @Input() open?: boolean = false;
  @Input() search?: string;

  private contactRepository = inject(ContactRepository);

  isSearching: boolean = false;
  groupHidden: boolean = false;


  ngOnInit(): void {
    //Verifica se teve alteração em dos contatos do grupo para reordenar a lista
    this.contactRepository.contactUpdate.pipe(
      filter(contact => contact?.groups.includes(this.rosterGroup?.name ?? '') ?? false)
    )
    .subscribe(contact => {
      //Acha o contact e atualiza ele
      const index = this.rosterGroup?.contacts.findIndex(contact => contact.jid === contact?.jid);
      if (index !== undefined && index !== -1) {
        this.rosterGroup!.contacts[index] = contact!;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
