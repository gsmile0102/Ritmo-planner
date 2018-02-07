import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
/**
 * Generated class for the ReminderModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reminder-modal',
  templateUrl: 'reminder-modal.html',
})
export class ReminderModalPage {

  presetTimes: any[];
  isCustomise: boolean;
  event: any;
  currentDate = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    this.event = this.navParams.get('event');
    this.isCustomise = false;
    this.presetTimes = [
      {code: 0, title: 'None', checked: false, hrs: null, min: null},
      {code: 1, title: 'On time', checked: false, hrs: 0, min: 0},
      {code: 2, title: '10 mins before', checked: false, hrs: 0, min: 10},
      {code: 3, title: '30 mins before', checked: false, hrs: 0, min: 30},
      {code: 4, title: '1 hour before', checked: false, hrs: 0, min: 0},
      {code: 5, title: '1 day before', checked: false, hrs: 23, min: 0},
    ];
  }

  ionViewDidLoad() {
  }

  addNotification() {
    let notificationTime = new Date();
    for(let time of this.presetTimes) {
      if(time.checked) {
        // if(time.code == 0) {
        //   this.notificationTime = "";
        // }
        // else if(time.code == 1) {
        //   this.notificationTime = this.event.startTime;
        //   this.event.reminder = moment(this.notificationTime).format();
        // }
        // else {
        //   this.notificationTime = new Date();
        //   this.notificationTime.setMinutes(time.hrs);
        //   this.notificationTime.setHours(time.min);
        //   this.event.reminder = moment(this.notificationTime).format();
        // }
        // this.notification = {
        //   id: this.event.id,
        //   title: this.event.title,
        //   at: this.notificationTime
        // };
        if(time.code == 0) {
          this.viewCtrl.dismiss();
        }
        else {
          let daysDiff = new Date(this.event.startTime).getDate() - this.currentDate.getDate();
          notificationTime.setHours(new Date(this.event.startTime).getHours() - time.hrs);
          notificationTime.setMinutes(new Date(this.event.startTime).getMinutes() - time.min);
          notificationTime.setSeconds(0);
        }
      }
    }
    let notification = {
      id: this.event.id,
      title: this.event.title,
      at: notificationTime
    }
    this.viewCtrl.dismiss(notification);
  }

  customise() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
