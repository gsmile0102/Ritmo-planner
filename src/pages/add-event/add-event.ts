import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';

import { NotificationProvider } from '../../providers/notification/notification';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AddEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {
  public myModel = ''
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  newEvent = {
    id: 0,
    title: "",
    startTime: "",
    endTime: "",
    allDay: false,
    reminder: "",
    description: "",
    colour: ""
  };

  selectedColour = '#cc0099';

  notifications = [];
  ntfTimeList = [];

  constructor(private navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private dbase: DatabaseProvider, public eventProvider: EventProvider, private ntfProvider: NotificationProvider) {
    // let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    let preselectedDate = this.navParams.get('selectedDay');
    this.newEvent.startTime = moment(preselectedDate).format('');
    this.newEvent.endTime = moment(preselectedDate).format('');
    this.newEvent.reminder = 'ntf' + (new Date()).getTime();
    this.newEvent.colour = this.selectedColour;
  }

  ionViewDidLoad() {
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: this.newEvent});
    modal.present();
    modal.onDidDismiss(ntfTime => {
      // let notfObj = {
      //   id: Math.floor(Math.random()*20)+1,
      //   title: this.newEvent.title,
      //   text: ntf.text,
      //   at: ntf.at,
      //   data: { reminder: this.newEvent.reminder }
      // };
      // this.notifications.push(notfObj);
      if(ntfTime != 0) {
        this.ntfTimeList.push(ntfTime);
      }
    });
  }

  // removeReminder(ntftext) {
  //   for(var i = 0; i < this.notifications.length;  i++) {
  //     if(this.notifications[i].text == ntftext) {
  //       this.notifications.splice(i, 1);
  //     }
  //   }
  // }
  removeReminder(ntftext) {
    for(var i = 0; i < this.ntfTimeList.length;  i++) {
      if(this.ntfTimeList[i].title == ntftext) {
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
        this.selectedColour = colour;
        this.newEvent.colour = colour;
      }
    });
  }

  processEventDateTime(): Promise<any> {
    return new Promise((resolve, reject) => {
      let startTime = new Date(this.newEvent.startTime);
      let endTime = new Date(this.newEvent.endTime);
      if(this.newEvent.allDay) {
        let daysDiff = startTime.getDate() === endTime.getDate() ? 1 : endTime.getDate() - startTime.getDate();
        let newStartTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 8, 0);
        let newEndTime = new Date(endTime.getFullYear(), endTime.getMonth(), startTime.getDate() + daysDiff, 8, 0);

        this.newEvent.startTime = moment(newStartTime).format('');
        this.newEvent.endTime = moment(newEndTime).format('');
        // this.newEvent.startTime = newStartTime;
        // this.newEvent.endTime = newEndTime;
      }
      else {
        this.newEvent.startTime = moment(startTime).format('');
        this.newEvent.endTime = moment(endTime).format('');
        // this.newEvent.startTime = startTime;
        // this.newEvent.endTime = endTime;
      }
      resolve(this.newEvent);
    });
  }

  saveEvent(): void {
    this.processEventDateTime().then((res) => {
      this.newEvent.id = (new Date()).getTime();
      // this.newEvent.reminder = this.notifications;
      this.dbase.addEvent(this.newEvent).then(res => {
        // this.eventProvider.createPersonalEvent(this.newEvent).then((newEvent) => {
        this.setNotifications();
          this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
            this.notifications = [];
          });
          this.viewCtrl.dismiss();
        });
      // });
    });
  }

  setNotifications(): void {
    for(let ntfTime of this.ntfTimeList) {
      let notificationTime = new Date();
      let daysDiff = new Date(this.newEvent.startTime).getDate() - (new Date()).getDate();
      notificationTime.setHours(new Date(this.newEvent.startTime).getHours() - ntfTime.hrs);
      notificationTime.setMinutes(new Date(this.newEvent.startTime).getMinutes() - ntfTime.min);
      notificationTime.setSeconds(0);
      let ntfObj = {
        id: Math.floor(Math.random()*20)+1,
        title: this.newEvent.title,
        text: ntfTime.title,
        at: notificationTime,
        data: { reminder: this.newEvent.reminder }
      };
      this.notifications.push(ntfObj);
    }
  }

}
