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

  startTime = new Date();
  endTime = new Date();

  notifications: any[] = [];

  constructor(private navCtrl: NavController, private navParams: NavParams, private modalCtrl: ModalController, private dbase: DatabaseProvider, private toast: Toast, private localNotifications: LocalNotifications) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: event});
    modal.present();
    modal.onDidDismiss((ntf) => {
      this.notifications.push(ntf);
    });
  }

  cancel() {
    this.navCtrl.popToRoot();
  }

  save() {
    this.startTime = new Date(this.event.startTime);
    this.endTime = new Date(this.event.endTime);
    if(this.event.allDay) {
      let daysDiff = this.startTime.getUTCDate() === this.endTime.getUTCDate() ? 1 : this.endTime.getUTCDate() - this.startTime.getUTCDate();
      let newStartTime = new Date(Date.UTC(this.startTime.getUTCFullYear(), this.startTime.getUTCMonth(), this.startTime.getUTCDate()));
      let newEndTime = new Date(Date.UTC(this.endTime.getUTCFullYear(), this.endTime.getUTCMonth(), this.endTime.getUTCDate() + daysDiff));
      this.event.startTime = moment(newStartTime).format();
      this.event.endTime = moment(newEndTime).format();
    }
    else {
      this.event.startTime = moment(this.startTime).format();
      this.event.endTime = moment(this.endTime).format();
    }


    // this.localNotifications.schedule(this.notifications);
    // this.notifications = [];
    this.dbase.addEvent(this.event).then(res => {
      this.navCtrl.popToRoot();
    });
  }

  scheduleNotification() {

  }

}
