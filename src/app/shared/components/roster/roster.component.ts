import { RosterRepository } from 'src/app/shared/repositories/roster/roster.repository';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { RosterService } from '../../services/roster/roster.service';
import { CommonModule } from '@angular/common';
import { RosterGroupComponent } from '../roster-group/roster-group.component';
import { IonContent, IonSearchbar, IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { Subscription, map, take } from 'rxjs';
import { ContactRepository } from '../../repositories/contact/contact.repository';
import { SortPipe } from '../../pipes/sort/sort.pipe';
import { ContactGroupModel } from '../../models/contact-group.model';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonLabel, 
    IonItem, 
    IonList,
    IonSearchbar,
    IonContent,
    CommonModule,
    RosterGroupComponent,
    SortPipe
  ],
})
export class RosterComponent implements OnInit, OnDestroy {
  public cdr = inject(ChangeDetectorRef);
  public rosterRepository = inject(RosterRepository);
  public contactResposioty = inject(ContactRepository);

  rosterSubscription!: Subscription;

  rosterList = signal<ContactGroupModel[]>([]);

  searchText = signal<string>('');

  constructor() { }

  ngOnInit(): void {
    this.rosterSubscription = this.rosterRepository.rosterList.pipe(
      map((contacts) => {
        const groupsMap = new Map<string, ContactGroupModel>();

        contacts.forEach((contact: any) => {
          contact.groups.forEach((group: any) => {
            if (!groupsMap.has(group)) {
              groupsMap.set(group, { name: group, contacts: [] });
            }
            const groupModel = groupsMap.get(group);
            if (groupModel) {
              groupModel.contacts.push(contact);
            }
          });
        });

        const groupedContacts: ContactGroupModel[] = Array.from(groupsMap.values());

        return groupedContacts;
      })
    )
    .subscribe((roster) => {
      this.rosterList.set(roster);
    });
  }

  ngOnDestroy(): void {
    this.rosterSubscription?.unsubscribe();
  }

  search(evt: any){
    this.searchText.set(evt.detail.value);
  }
}
