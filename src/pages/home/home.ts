import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import * as moment from 'moment';
import { Subscription} from 'rxjs/Subscription';

// import { AddEventPage } from '../add-event/add-event';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  eventSource = [];
  viewTitle: string;
  isToday: boolean;
  selectedDay = new Date();
  // dbReady: boolean;
  connected: Subscription;
  disconnected: Subscription;

  calendar = {
      mode: 'month',
      currentDate: new Date()
  };

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private localNotifications: LocalNotifications, private toast: ToastController, private dbase: DatabaseProvider, private eventProvider: EventProvider, private network: Network) {
    // this.dbase.getDatabaseState().subscribe(rdy => {
    //   this.dbReady = rdy;
    // });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
  }

  ionViewWillEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      this.dbase.getEventsData().then((res) => {
        this.eventProvider.syncEventsData(res);
      });
    });

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.toast.create({
        message: 'You are not connected to network',
        duration: 3000,
        position: 'top'
      }).present();
    });

    if(this.network.type !== "none") {
      this.dbase.getEventsData().then((res) => {
        this.eventProvider.syncEventsData(res);
      });
    }

    this.loadEventsData();
  }

  loadEventsData() {
    this.dbase.getEventsData().then((res) => {
      let events = [];
        for(let ev of res) {
          if(ev.allDay == 'true') {
            events.push({
              id: ev.id,
              title: ev.title,
              startTime: new Date(ev.startTime),
              endTime: new Date(ev.endTime),
              allDay: true,
              reminder: ev.reminder,
              description: ev.description
            });
          }
          else {
            events.push({
              id: ev.id,
              title: ev.title,
              startTime: new Date(ev.startTime),
              endTime: new Date(ev.endTime),
              allDay: false,
              reminder: ev.reminder,
              description: ev.description
            });
          }
        }
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });

    }, (err) => {});

    // let events = [];
    //
    // this.eventProvider.getPersonalEventList().snapshotChanges().subscribe((actions) => {
    //   actions.forEach(action => {
    //     events.push({
    //       id: action.payload.key,
    //       title: action.payload.val().title,
    //       startTime: new Date(action.payload.val().startTime),
    //       endTime: new Date(action.payoload.val().endTime),
    //       allDay: action.payload.val().allDay,
    //       reminder: action.payload.val().reminder,
    //       description: action.payload.val().description
    //     });
    //   });
    // });
    //
    // this.eventSource = [];
    // setTimeout(() => {
    //   this.eventSource = events;
    // });
  }

  ionViewWillLeave() {
  }

  addEvent() {
    // this.navCtrl.push(AddEventPage, {selectedDay: this.selectedDay});
    // let modal = this.modalCtrl.create('EditEventModalPage', {selectedDay: this.selectedDay});
    // modal.present();
    // modal.onDidDismiss(data => {
    //   this.loadEventsData();
    // });
    let modal = this.modalCtrl.create('AddEventPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      this.loadEventsData();
    });
  }
  //
  editEvent(event) {
    let modal = this.modalCtrl.create('EditEventModalPage', {event: event});
    modal.present();
    modal.onDidDismiss(data => {
      this.loadEventsData();
    });
  }

  deleteEvent(event) {
    this.dbase.deleteEvent(event).then((res) => {
      this.toast.create({
        message: 'Event has been deleted.',
        duration: 2500,
        position: 'top'
      }).present();
      this.loadEventsData();
    });
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: event.allDay == 'true' ? 'All Day' : 'From: ' + start + '<br>To: ' + end + '<br>' + event.reminder,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Edit',
          handler: () => {
            let modal = this.modalCtrl.create('EditEventModalPage', {
              event: event
            });
            modal.present();
            modal.onDidDismiss(data => {
              this.loadEventsData();
            });
          }
        }
      ]
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onCurrentDateChanged(event: Date){
    var today = new Date();
    today.setHours(0,0,0,0);
    event.setHours(0,0,0,0);
    this.isToday = today.getTime() === event.getTime();
  }

  markDisabled = (date:Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

  prevMonth() {
    this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() - 1));
  }

  nextMonth() {
    this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + 1));
  }

}
