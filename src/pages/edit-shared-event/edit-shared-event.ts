import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import { NotificationProvider } from '../../providers/notification/notification';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the EditSharedEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-shared-event',
  templateUrl: 'edit-shared-event.html',
})
export class EditSharedEventPage {

  event = {
    id: 0,
    owner: "",
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    reminder: "",
    description: "",
    colour: ""
  };

  notifications = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private dbase: DatabaseProvider, public eventProvider: EventProvider, private ntfProvider: NotificationProvider) {
  }

  ionViewDidLoad() {
    let editEvent = this.navParams.get('event');
    this.event = editEvent;
    this.event.startTime = moment(editEvent.startTime).format();
    this.event.endTime = moment(editEvent.endTime).format();
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

}
