import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import { AuthProvider } from '../../providers/auth/auth';

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
  currentUser: any = null;
  isSameUser: boolean = false;

  eventSource = [];
  viewTitle: string;
  isToday: boolean;
  selectedDay = new Date();
  sharedEvent = null;
  // dbReady: boolean;
  connected: Subscription;
  disconnected: Subscription;

  calendar = {
      mode: 'month',
      currentDate: new Date()
  };

  constructor(private navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private modalCtrl: ModalController, private localNotifications: LocalNotifications, private toast: ToastController, private dbase: DatabaseProvider, private eventProvider: EventProvider, private authProvider: AuthProvider, private network: Network, private storage: Storage) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser = user;
      }
    });
  }

  ionViewDidLoad() {
    // this.dbase.getLastLogInUser().then((user) => {
    //   if(this.currentUser.uid == user.uid) {
    //     this.isSameUser = true;
    //   }
    //   else {
    //     this.isSameUser = false;
    //     this.dbase.addCurrentLogInUser(this.currentUser.uid);
    //   }
    // });
  }

  ionViewWillEnter() {
    this.authProvider.getLoginStatus().then((val) => {
      if(val) {
        this.prepopulateEventsData().then(() => {
          this.authProvider.setAsLogout();
        });
      }
      else {
        // this.connected = this.network.onConnect().subscribe(data => {
        //   this.dbase.getEventsData().then((res) => {
        //     this.eventProvider.syncEventsData(res);
        //   });
        // });
        if(this.network.type !== "none") {
          this.dbase.getEventsData().then((res) => {
            this.eventProvider.syncEventsData(res);
          });
        }
      }
    })

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.toast.create({
        message: 'You are not connected to network',
        duration: 3000,
        position: 'top'
      }).present();
    });

    this.loadEventsData();
  }

  loadEventsData() {
    this.dbase.getEventsData().then((res) => {
      let events = [];
        for(let ev of res) {
          events.push({
            id: ev.id,
            title: ev.title,
            startTime: new Date(ev.startTime),
            endTime: new Date(ev.endTime),
            allDay: ev.allDay == 'true' ? true : false,
            reminder: ev.reminder,
            description: ev.description,
            colour: ev.colour
          });
        }
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });

    }, (err) => {});
  }

  prepopulateEventsData(): Promise<any> {
    return new Promise((resolve) => {
      this.eventProvider.getPersonalEventList().once('value', (evtListSnapshot) => {
        evtListSnapshot.forEach((snap) => {
          var event = {
            id: snap.key,
            title: snap.val().title,
            startTime: moment(snap.val().startTime).format(''),
            endTime: moment(snap.val().endTime).format(''),
            allDay: snap.val().allDay,
            reminder: snap.val().reminder,
            description: snap.val().description,
            colour: snap.val().colour
          };
          this.dbase.addEvent(event);
          return false;
        });
      });
      resolve();
    });
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

  goToEventDetail(evtId: string): void {
    this.navCtrl.push('PersonalEventDetailPage', { eventId: evtId });
  }

  goToCreatePersonalEvent(): void {
    this.navCtrl.push('AddEventPage', { selectedDay: new Date() });
  }

  goToCreateSharedEvent(): void {
    this.navCtrl.push('SharedEventCreatePage');
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
    // let start = moment(event.startTime).format('LLLL');
    // let end = moment(event.endTime).format('LLLL');
    //
    // let alert = this.alertCtrl.create({
    //   title: '' + event.title,
    //   subTitle: event.allDay == 'true' ? 'All Day' : 'From: ' + start + '<br>To: ' + end + '<br>' + event.reminder + event.colour,
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel'
    //     },
    //     {
    //       text: 'Edit',
    //       handler: () => {
    //         let modal = this.modalCtrl.create('EditEventModalPage', {
    //           event: event
    //         });
    //         modal.present();
    //         modal.onDidDismiss(data => {
    //           this.loadEventsData();
    //         });
    //       }
    //     }
    //   ]
    // })
    // alert.present();
    this.goToEventDetail(event.id);
  }

  editEvent(event) {
    let modal = this.modalCtrl.create('EditPersonalEventPage', {event: event});
    modal.present();
    modal.onDidDismiss(data => {
      if(data != 0) {
        this.loadEventsData();
      }
    });
  }

  setStyle(evtColour) {
    let eventStyle = {};
    if(evtColour == '#cc0099') {
      eventStyle = {
        'border-left' : '5px solid #cc0099'
     };
    }
    if(evtColour == '#9999ff') {
       eventStyle = {
        'background' : 'linear-gradient(to top right, #9900ff 0%, #9999ff 100%)'
      };
    }
    if(evtColour == '#b3003b') {
       eventStyle = {
        'background' : 'linear-gradient(to top right, #b3003b 0%, #ff6699 100%)'
      };
    }
    if(evtColour == '#ffa64d') {
       eventStyle = {
        'background' : 'linear-gradient(to top right, #ff661a 0%, #ffa64d 100%)'
      };
    }
    if(evtColour == '#00ff99') {
       eventStyle = {
        'background' : 'linear-gradient(to top right, #00cc99 0%, #00ff99 100%)'
      };
    }
    if(evtColour == '#0099ff') {
       eventStyle = {
        'background' : 'linear-gradient(to top right, #005c99 0%, #0099ff 100%)'
      };
    }

    return eventStyle;
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
