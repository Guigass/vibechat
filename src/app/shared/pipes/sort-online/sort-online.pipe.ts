import { Pipe, PipeTransform } from '@angular/core';
import { ContactModel } from '../../models/contact.model';

@Pipe({
  name: 'sortOnline',
  standalone: true
})
export class SortOnlinePipe implements PipeTransform {

  transform(value: ContactModel[]): any {
    if (!value) return value;

    const online = value.filter(contact => contact.presence?.type?.toLocaleLowerCase() === 'online');
    const other = value.filter(contact => contact.presence?.type && contact.presence?.type?.toLocaleLowerCase() !== 'online' && contact.presence?.type?.toLocaleLowerCase() !== 'offline');
    const offline = value.filter(contact => contact.presence?.type?.toLocaleLowerCase() === 'offline' || !contact.presence?.type || contact.presence?.type?.toLocaleLowerCase() === 'unavailable');

    const list = online.concat(other).concat(offline);

    return list;
  }

}
