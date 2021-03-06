import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import { AuthProvider } from '../../providers/auth/auth';

import * as moment from 'moment';
import { Subscription} from 'rxjs/Subscription';

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

  constructor(private navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private modalCtrl: ModalController, private localNotifications: LocalNotifications, private toast: ToastController, private dbase: DatabaseProvider, private eventProvider: EventProvider, private authProvider: AuthProvider, private network: Network, private storage: Storage, private fcm: FCM) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser = user;
      }
    });
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.authProvider.getLoginStatus().then((val) => {
      if(val) {
        this.prepopulateEventsData().then(() => {
          this.authProvider.setAsLogout();
        });
      }
      else {
        if(this.network.type !== "none") {
          this.dbase.getEventsData().then((evtData) => {
            this.eventProvider.syncEventsData(evtData);
          });
          this.tokenSetup().then((token) => {
            this.storeToken(token);
          });

          this.fcm.onNotification().subscribe((data) => {
            if(data.wasTapped) {
              // let toast = this.toast.create({
              //   message: data.senderName + ' invited you to join ' + data.evtMessage + ' event. Go and check on it!',
              //   duration: 3000,
              //   position: 'top'
              // });
              // toast.present();
            }
            else {
              if(data.senderId != this.currentUser.uid) {
                let toast = this.toast.create({
                  message: data.message,
                  duration: 4000,
                  cssClass: 'notificationToast',
                  position: 'top'
                });
                toast.present();
                console.log(JSON.stringify(data));
              }
            }
          });
          this.fcm.onTokenRefresh().subscribe((token) => {
            var tokenUpdate = {};
            tokenUpdate['userProfile/' + this.currentUser.uid + '/pushToken'] = token;

            firebase.database().ref().update(tokenUpdate);
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

  tokenSetup() {
    var promise = new Promise((resolve, reject) => {
      this.fcm.getToken().then((token) => {
        resolve(token);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  storeToken(token) {
    var tokenUpdate = {};
    tokenUpdate['userProfile/' + this.currentUser.uid + '/pushToken'] = token;
    firebase.database().ref().update(tokenUpdate);
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
    let alert = this.alertCtrl.create({
      title: 'Delete this event?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dbase.deleteEvent(event).then((res) => {
              this.toast.create({
                message: 'Event has been deleted.',
                duration: 2500,
                position: 'top'
              }).present();
              this.loadEventsData();
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  goToEventDetail(evtId: string): void {
    this.navCtrl.push('PersonalEventDetailPage', { eventId: evtId });
  }

  goToCreatePersonalEvent(): void {
    // this.navCtrl.push('AddEventPage', { selectedDay: new Date() });
    let modal = this.modalCtrl.create('AddEventPage', {selectedDay: new Date()});
    modal.present();
    modal.onDidDismiss(data => {

    });
  }

  goToCreateSharedEvent(): void {
    // this.navCtrl.push('SharedEventCreatePage');
    let modal = this.modalCtrl.create('SharedEventCreatePage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {

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
    // current.setHours(0, 0, 0);
    return date < current;
  };

  prev() {
    if(this.calendar.mode == 'month') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() - 1));
    }
    if(this.calendar.mode == 'week') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setDate(this.calendar.currentDate.getDate() - 7));
    }
    if(this.calendar.mode == 'day') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setDate(this.calendar.currentDate.getDate() - 1));
    }
  }

  next() {
    if(this.calendar.mode == 'month') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + 1));
    }
    if(this.calendar.mode == 'week') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setDate(this.calendar.currentDate.getDate() + 7));
    }
    if(this.calendar.mode == 'day') {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setDate(this.calendar.currentDate.getDate() + 1));
    }
  }

}
