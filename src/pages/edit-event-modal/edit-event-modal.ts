import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { NotificationProvider } from '../../providers/notification/notification';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the EditEventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-event-modal',
  templateUrl: 'edit-event-modal.html',
})
export class EditEventModalPage {

  event = {
    id: 0,
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    reminder: 0,
    description: ""
  };

  notifications = [];
  isNewEvent: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private modalCtrl: ModalController, private dbase: DatabaseProvider, private ntfProvider: NotificationProvider, private localNotifications: LocalNotifications) {
    let editEvent = this.navParams.get('event');
    // if(editEvent) {
      this.event.id = editEvent.id;
      this.event.title = editEvent.title;
      this.event.startTime = moment(editEvent.startTime).format();
      this.event.endTime = moment(editEvent.endTime).format();
      this.event.allDay = editEvent.allDay;
      this.event.reminder = editEvent.reminder;
      this.event.description = editEvent.description;
      this.isNewEvent = false;
      this.loadReminders();
    // }
    // else {
    //   let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    //   this.event.startTime = preselectedDate;
    //   this.event.endTime = preselectedDate;
    //   this.event.reminder = new Date().getTime();
    //   this.isNewEvent = true;
    // }
  }

  ionViewDidLoad() {
  }

  loadReminders() {
    // this.localNotifications.getAll().then((res) => {
    //   for(let ntf of res) {
    //     let obj = JSON.parse(ntf.data);
    //     if(obj.eventId == this.event.id) {
    //       this.notifications.push(ntf);
    //     }
    //   }
    // });
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
      let notfObj = {
        id: Math.floor(Math.random()*200)+1,
        title: this.event.title,
        text: ntf.text,
        at: ntf.at,
        data: { reminder: this.event.reminder }
      };
      this.notifications.push(notfObj);
    });
  }

  removeReminder(ntftext) {
    for(var i = 0; i < this.notifications.length; i++) {
      if(this.notifications[i].text == ntftext) {
        this.notifications.splice(i, 1);
      }
    }
  }

  cancel() {
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

    this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
      this.notifications = [];
    });

    // if(this.isNewEvent) {
      // this.dbase.updateEvent(this.event).then((res) => {
      //   this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
      //     this.notifications = [];
      //   });
      //   // this.navCtrl.popToRoot();
      //   this.viewCtrl.dismiss();
      // }, err => {});
    // }
    // else
    // {
    //   this.dbase.updateEvent(this.event).then((res) => {
        // this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
        //   this.notifications = [];
        // });
      //   this.viewCtrl.dismiss();
      // }, (err) => {});
    // }
  }

  scheduleNotification() {
    this.localNotifications.schedule(this.notifications);
    this.notifications = [];
  }

}
