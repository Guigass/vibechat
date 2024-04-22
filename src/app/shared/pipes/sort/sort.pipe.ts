import { Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Pipe({
  name: 'sort',
  standalone: true,
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortOrder: SortOrder = 'asc', sortKey?: string): any {
    sortOrder = sortOrder.toLowerCase() as SortOrder;

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;

    let sortedArray: any[] = [];

    if (!sortKey) {
      sortedArray = value.sort();
    } else {
      // Classificar por sortKey, verificando se é número, string ou data
      sortedArray = value.slice().sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue instanceof Date && bValue instanceof Date) {
          return aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        } else {
          // Fallback para caso os tipos não sejam previstos
          return 0;
        }
      });
    }

    return sortOrder === 'asc' ? sortedArray : sortedArray.reverse();
  }
}
