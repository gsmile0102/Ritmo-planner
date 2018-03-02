import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from 'moment';
// import { AddEventPage } from '../add-event/add-event';
import { LocalNotifications } from '@ionic-native/local-notifications';

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

  calendar = {
      mode: 'month',
      currentDate: new Date()
  };

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private localNotifications: LocalNotifications, private toast: Toast, private dbase: DatabaseProvider) {
    // this.dbase.getDatabaseState().subscribe(rdy => {
    //   this.dbReady = rdy;
    // });
  }

  ionViewDidLoad() {
      this.loadEventsData();
  }

  ionViewWillEnter() {
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
          //
          // let eventData = ev;
          //
          // eventData.startTime = new Date(ev.startTime);
          // eventData.endTime = new Date(ev.endTime);
          //
          // events.push(eventData);
        }
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
    }, (err) => {});
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
      this.toast.show('Event deleted', '5000', 'center');
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
}
