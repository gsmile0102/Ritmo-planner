import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from 'moment';
import { Toast } from '@ionic-native/toast';
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
    reminder: "",
    description: ""
  };

  notif = {
    id: 0,
    title: '',
    at: new Date()
  };
  notifications: notif[] = [];

  constructor(private navCtrl: NavController, private navParams: NavParams, private modalCtrl: ModalController, private dbase: DatabaseProvider, private toast: Toast, private localNotifications: LocalNotifications) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: this.event});
    modal.present();
    modal.onDidDismiss(ntf => {
      this.notif = ntf;
      this.notifications.push(ntf);
    });
  }

  cancel() {
    this.navCtrl.popToRoot();
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

    this.localNotifications.schedule(this.notifications);
    this.notifications = [];
    this.dbase.addEvent(this.event).then(res => {
      this.navCtrl.popToRoot();
    });
  }

  scheduleNotification() {

  }

}
