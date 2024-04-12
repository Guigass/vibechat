import { Pipe, PipeTransform } from '@angular/core';
import { ContactModel } from '../../models/contact.model';

@Pipe({
  name: 'sortOnline',
  standalone: true
})
export class SortOnlinePipe implements PipeTransform {

  transform(value: ContactModel[]): any {
    if (!value) return value;

    const online = value.filter(contact => contact.presence?.status === 'online');
    const offline = value.filter(contact => contact.presence?.status !== 'online');

    return online.concat(offline);

  }

}
