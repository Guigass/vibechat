import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { ContactGroupModel } from '../../models/contact-group.model';
import { RosterContactItemComponent } from '../../components/roster-contact-item/roster-contact-item.component';
import { IonAccordionGroup, IonAccordion, IonLabel, IonItem, IonList } from "@ionic/angular/standalone";
import { SortOnlinePipe } from '../../pipes/sort-online/sort-online.pipe';

@Component({
  selector: 'app-roster-group',
  templateUrl: './roster-group.component.html',
  styleUrls: ['./roster-group.component.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, CommonModule, RosterContactItemComponent, SortOnlinePipe],
})
export class RosterGroupComponent implements OnChanges{
  @Input() rosterGroup?: ContactGroupModel;
  @Input() index?: number;
  @Input() open?: boolean = false;
  @Input() search?: string;

  isSearching: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['search'].firstChange === false && changes['search'].currentValue !== ''){
      
      const searchResult = this.rosterGroup?.contacts.filter(contact => contact.name.toLowerCase().includes(changes['search'].currentValue.toLowerCase()));
      this.open = searchResult && searchResult.length > 0;
      
      this.isSearching = true;

      this.rosterGroup?.contacts.forEach(contact => {
        if(searchResult?.findIndex(search => search.jid === contact.jid) === -1){
          contact.hidden = true;
        } else {
          contact.hidden = false;
        }
      });
    } else {
      this.rosterGroup?.contacts.forEach(contact => {
        contact.hidden = false;
      });

      this.open = false;
      this.isSearching = false;
    }
  }
}
