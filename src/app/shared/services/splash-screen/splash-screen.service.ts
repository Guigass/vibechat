import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {
  onChanges = new BehaviorSubject<boolean>(true);

  constructor() { }

  hide() {
    console.log('hide');
    this.onChanges.next(false);
  }

  show() {
    this.onChanges.next(true);
  }
}
