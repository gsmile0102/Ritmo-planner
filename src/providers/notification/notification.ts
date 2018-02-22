import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  notifications = [];

  constructor(private localNotifications: LocalNotifications) {
  }

  scheduleReminder(ntfLst) {
    return new Promise((resolve, reject) => {
      this.localNotifications.schedule(ntfLst);
      resolve(this.localNotifications);
    });
  }

  getLNotifications(): Promise<LocalNotifications> {
    return new Promise((resolve, reject) => {
      resolve(this.localNotifications);
    });
  }

  clearNotifications() {
    return this.localNotifications.cancelAll();
  }

  deleteReminder() {
    return new Promise((resolve, reject) => {

    });
  }

}
