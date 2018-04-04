import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';

import { NotificationProvider } from '../../providers/notification/notification';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the EditPersonalEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-personal-event',
  templateUrl: 'edit-personal-event.html',
})
export class EditPersonalEventPage {

  event = {
    id: 0,
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    reminder: "",
    description: "",
    colour: ""
  };

  notifications = [];
  ntfTimeList = [];

  isNewEvent: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private dbase: DatabaseProvider, public eventProvider: EventProvider, private ntfProvider: NotificationProvider) {

  }

  ionViewDidLoad() {
    let editEvent = this.navParams.get('event');
    this.event.id = editEvent.id;
    this.event.title = editEvent.title;
    this.event.startTime = moment(editEvent.startTime).format();
    this.event.endTime = moment(editEvent.endTime).format();
    this.event.allDay = editEvent.allDay;
    this.event.reminder = editEvent.reminder;
    this.event.description = editEvent.description;
    this.event.colour = editEvent.colour;

    this.isNewEvent = false;
    this.loadReminders();
  }

  loadReminders() {
    this.ntfProvider.getLNotifications().then((lntf) => {
      lntf.getAll().then((res) => {
        for(let ntf of res) {
          let obj = JSON.parse(ntf.data);
          if(obj.reminder == this.event.reminder) {
            this.notifications.push(ntf);
          }
        }
      }, (err) => {});
    });
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: this.event});
    modal.present();
    modal.onDidDismiss(ntf => {
      if(ntf != 0) {
        // let notfObj = {
        //   id: Math.floor(Math.random()*200)+1,
        //   title: this.event.title,
        //   text: ntf.text,
        //   at: ntf.at,
        //   data: { reminder: this.event.reminder }
        // };
        this.ntfTimeList.push(ntf);
      }
    });
  }

  removeReminder(ntftext) {
    for(var i = 0; i < this.ntfTimeList.length; i++) {
      if(this.ntfTimeList[i].text == ntftext) {
        this.ntfTimeList.splice(i, 1);
      }
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  setColor() {
    let modal = this.modalCtrl.create('EventColorPickerPage');
    modal.present();
    modal.onDidDismiss((colour) => {
      if(colour !== '') {
        this.event.colour = colour;
      }
    });
  }

  processEventDateTime(): Promise<any> {
    return new Promise((resolve, reject) => {
      let startTime = new Date(this.event.startTime);
      let endTime = new Date(this.event.endTime);
      if(this.event.allDay) {
        let daysDiff = startTime.getDate() === endTime.getDate() ? 1 : endTime.getDate() - startTime.getDate();
        let newStartTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 8, 0);
        let newEndTime = new Date(endTime.getFullYear(), endTime.getMonth(), startTime.getDate() + daysDiff, 8, 0);

        this.event.startTime = moment(newStartTime).format('');
        this.event.endTime = moment(newEndTime).format('');
      }
      else {
        this.event.startTime = moment(startTime).format('');
        this.event.endTime = moment(endTime).format('');
      }
      resolve(this.event);
    });
  }

  resetNotification(): Promise<any> {
    return new Promise((resolve, reject) => {
      for(let ntf of this.notifications) {
        this.ntfProvider.getLNotifications().then((lntf) => {
          lntf.clear(ntf.id);
        });
      }
      resolve();
    });
  }

  setNotifications(): void {
    for(let ntfTime of this.ntfTimeList) {
      let notificationTime = new Date();
      let daysDiff = new Date(this.event.startTime).getDate() - (new Date()).getDate();
      notificationTime.setHours(new Date(this.event.startTime).getHours() - ntfTime.hrs);
      notificationTime.setMinutes(new Date(this.event.startTime).getMinutes() - ntfTime.min);
      notificationTime.setSeconds(0);
      let ntfObj = {
        id: Math.floor(Math.random()*20)+1,
        title: this.event.title,
        text: ntfTime.title,
        at: notificationTime,
        data: { reminder: this.event.reminder }
      };
      this.notifications.push(ntfObj);
    }
  }

  saveEvent(): void {
    this.processEventDateTime().then((res) => {
      // this.event.reminder = this.notifications;
      let oldEventId = this.event.id;
      this.event.id = (new Date()).getTime();
      this.dbase.updateEvent(oldEventId, this.event).then(res => {
          this.resetNotification().then(() => {
            this.setNotifications();
            this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
              this.notifications = [];
              this.viewCtrl.dismiss(this.event.id);
            // this.navCtrl.push('PersonalEventDetailPage', {eventId: this.event.id});
            });
          });
        });
    });
  }


}
