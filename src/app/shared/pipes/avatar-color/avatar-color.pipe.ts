import { Pipe, PipeTransform } from '@angular/core';
import { PresenceType } from '../../enums/presence-type.enum';

@Pipe({
  name: 'avatarColor',
  standalone: true
})
export class AvatarColorPipe implements PipeTransform {

  transform(value?: PresenceType): string {
    switch (value) {
      case PresenceType.Online:
        return 'green';
      case PresenceType.Away:
        return 'orange';
      case PresenceType.DND:
        return 'red';
      case PresenceType.XA:
        return 'yellow';
      case PresenceType.Offline:
        return 'grey';
      default:
        return 'grey';
    }
  }
}
