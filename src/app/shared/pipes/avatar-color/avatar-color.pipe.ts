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
      case PresenceType.Offline:
        return 'red';
      default:
        return 'yellow';
    }
  }
}
