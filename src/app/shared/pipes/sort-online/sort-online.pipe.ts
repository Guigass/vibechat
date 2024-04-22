import { Pipe, PipeTransform } from '@angular/core';
import { ContactModel } from '../../models/contact.model';
import { PresenceModel } from '../../models/presence.model';
import { PresenceType } from '../../enums/presence-type.enum';

@Pipe({
  name: 'sortOnline',
  standalone: true,
  pure: false
})
export class SortOnlinePipe implements PipeTransform {

  transform(value: ContactModel[], presenceMap: Map<string, PresenceModel | undefined>): any {
    if (!value) return value;

    const sortedContacts = value.slice().sort((a, b) => {

      const aPresence = presenceMap.get(a.jid)?.type || PresenceType.Offline;
      const bPresence = presenceMap.get(b.jid)?.type || PresenceType.Offline;

      const presenceComparison = this.getPresenceWeight(aPresence) - this.getPresenceWeight(bPresence);
      if (presenceComparison !== 0) {
        return presenceComparison;
      }

      return a.jid.localeCompare(b.jid);
    });

    return sortedContacts
  }

  getPresenceWeight(presenceType: string): number {
    switch (presenceType) {
      case PresenceType.Online: return 1;
      case PresenceType.Away: return 2;
      case PresenceType.DND: return 3;
      default: return 4;
    }
  }

}
