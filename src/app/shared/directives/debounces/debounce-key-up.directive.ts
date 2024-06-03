import { Directive, HostListener } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';

@Directive({
  selector: '[appDebounceKeyUp]',
  standalone: true
})
export class DebounceKeyUpDirective extends AbstractDebounceDirective {

  constructor() { 
    super();
  }

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: any): void {
    this.isDebouncing.emit(true);
    event.preventDefault();
    this.emitEvent$.next(event);
  }

}
