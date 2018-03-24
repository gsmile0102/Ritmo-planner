import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import * as firebase from 'firebase';
import { Subscription} from 'rxjs/Subscription';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { EventProvider } from '../../providers/event/event';
import { DatabaseProvider } from '../../providers/database/database';
import "rxjs/add/operator/map";

/**
 * Generated class for the PersonalEventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-event-list',
  templateUrl: 'personal-event-list.html',
})
export class PersonalEventListPage {
  public currentUser: any = null;
  public events = [];
  // public events = [];
  connected: Subscription;
  disconnected: Subscription;
  eventStyle = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, public db: AngularFireDatabase, private dbase: DatabaseProvider, private toast: ToastController, private network: Network, private modalCtrl: ModalController) {
    this.currentUser = this.eventProvider.getCurrentUser();
    // this.events = this.eventProvider.getPersonalEventList();
  }

  ionViewDidLoad() {

    // this.dbase.getEventsData().then((res) => {
    //   this.events = [];
    //     for(let ev of res) {
    //       if(ev.allDay == 'true') {
    //         this.events.push({
    //           id: ev.id,
    //           title: ev.title,
    //           startTime: new Date(ev.startTime),
    //           endTime: new Date(ev.endTime),
    //           allDay: true,
    //           reminder: ev.reminder,
    //           description: ev.description
    //         });
    //       }
    //       else {
    //         this.events.push({
    //           id: ev.id,
    //           title: ev.title,
    //           startTime: new Date(ev.startTime),
    //           endTime: new Date(ev.endTime),
    //           allDay: false,
    //           reminder: ev.reminder,
    //           description: ev.description
    //         });
    //       }
    //     }
    // }, (err) => {});
  }

  ionViewWillEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      this.dbase.getEventsData().then((res) => {
        this.eventProvider.syncEventsData(res);
      });
    }, (err) => console.error(err));

    this.disconnected = this.network.onDisconnect().subscribe(data => {

    }, (err) => console.error(err));

    if(this.network.type !== "none") {
      this.dbase.getEventsData().then((res) => {
        this.eventProvider.syncEventsData(res);
      });
    }
    else {
      this.toast.create({
        message: 'You are not connected to network',
        duration: 3000,
        position: 'top'
      }).present();
    }
    this.loadEventsData();
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  loadEventsData() {
    this.dbase.getEventsData().then((res) => {
      this.events = [];
        for(let ev of res) {
            this.events.push({
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
    }, (err) => { });
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

  editEvent(event) {
    let modal = this.modalCtrl.create('EditPersonalEventPage', {event: event});
    modal.present();
    modal.onDidDismiss(data => {
      if(data != 0) {
        this.loadEventsData();
      }
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

  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key]
    });
  }

  setStyle(evtColour) {
    let eventStyle = {};
    if(evtColour == '#cc0099') {
      eventStyle = {
        'border' : '2px solid #cc0099'
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

  compare(eventA, eventB) {
    if(eventA.startTime.getTime() < eventB.startTime.getTime())
      return -1;
    if(eventA.startTime.getTime() > eventB.startTime.getTime())
      return 1;
    return 0;
  }

}
