import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
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

  event = {
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    reminder: 0,
    description: ""
  };

  notifications = [];

  constructor(private navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private dbase: DatabaseProvider, private ntfProvider: NotificationProvider) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
    this.event.reminder = new Date().getTime();
  }

  ionViewDidLoad() {
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: this.event});
    modal.present();
    modal.onDidDismiss(ntf => {
      let notfObj = {
        id: Math.floor(Math.random()*20)+1,
        title: this.event.title,
        text: ntf.text,
        at: ntf.at,
        data: { reminder: this.event.reminder }
      };
      this.notifications.push(notfObj);
    });
  }

  removeReminder(ntftext) {
    for(var i = 0; i < this.notifications.length;  i++) {
      if(this.notifications[i].text == ntftext) {
        this.notifications.splice(i, 1);
      }
    }
  }

  cancel() {
    // this.navCtrl.popToRoot();
    this.viewCtrl.dismiss();
  }

  save() {
    let startTime = new Date(this.event.startTime);
    let endTime = new Date(this.event.endTime);
    if(this.event.allDay) {
      let daysDiff = startTime.getDate() === endTime.getDate() ? 1 : endTime.getDate() - startTime.getDate();
      let newStartTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 8, 0);
      let newEndTime = new Date(endTime.getFullYear(), endTime.getMonth(), startTime.getDate() + daysDiff, 8, 0);

      this.event.startTime = moment(newStartTime).format();
      this.event.endTime = moment(newEndTime).format();
    }
    else {
      this.event.startTime = moment(startTime).format();
      this.event.endTime = moment(endTime).format();
    }
    this.dbase.addEvent(this.event).then(res => {
      this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
        this.notifications = [];
      });
      // this.navCtrl.popToRoot();
      this.viewCtrl.dismiss();
    }, err => { });
  }

}
