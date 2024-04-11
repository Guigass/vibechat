import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data',
  standalone: true
})
export class DataPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';

    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dateObj = new Date(value);
    const diaDaSemana = diasDaSemana[dateObj.getDay()];
    const hora = dateObj.getHours().toString().padStart(2, '0');
    const minuto = dateObj.getMinutes().toString().padStart(2, '0');

    return `${diaDaSemana}, ${hora}:${minuto}`;
  }

}
