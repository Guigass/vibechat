import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  requestPermission(): void {
    if (!('Notification' in window)) {
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.log('Permission was denied');
        }
      });
    }
  }

  sendNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else {
      this.requestPermission();
    }
  }
}
