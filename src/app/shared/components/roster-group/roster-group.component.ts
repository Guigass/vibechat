import { Component, Input, OnInit, inject } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { ContactGroupModel } from '../../models/contact-group.model';
import { RosterContactItemComponent } from '../../components/roster-contact-item/roster-contact-item.component';
import { IonAccordionGroup, IonAccordion, IonLabel, IonItem, IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-roster-group',
  templateUrl: './roster-group.component.html',
  styleUrls: ['./roster-group.component.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, CommonModule, RosterContactItemComponent],
})
export class RosterGroupComponent{
  @Input() rosterGroup?: ContactGroupModel;
}
