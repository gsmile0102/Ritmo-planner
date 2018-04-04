import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Loading, LoadingController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import * as firebase from 'firebase';

import { EventProvider } from '../../providers/event/event';
import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the SharedEventListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shared-event-list',
  templateUrl: 'shared-event-list.html',
})
export class SharedEventListPage {
  public loading: Loading;
  selectedDay = new Date();

  currentUser: any = null;
  sharedEvents = [];
  evtAtt = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private dbase: DatabaseProvider, private toast: ToastController, private modalCtrl: ModalController, private network: Network, private loadingCtrl: LoadingController) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
      this.loadEventsData();
  }

  goToCreatePersonalEvent(): void {
    // this.navCtrl.push('AddEventPage', { selectedDay: new Date() });
    let modal = this.modalCtrl.create('AddEventPage', {selectedDay: new Date() });
    modal.present();
    modal.onDidDismiss(data => {

    });
  }

  goToCreateSharedEvent(): void {
    // this.navCtrl.push('SharedEventCreatePage');
    let modal = this.modalCtrl.create('SharedEventCreatePage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(() => {
      this.loadEventsData();
    });
  }

  loadEventsData() {
    this.sharedEvents = [];
    this.eventProvider.getSharedEventList().once('value', (snapshot) => {
      snapshot.forEach((snap) => {
        this.sharedEvents.push({
          id: snap.key,
          owner: snap.val().owner,
          title: snap.val().title,
          startTime: new Date(snap.val().startTime),
          endTime: new Date(snap.val().endTime),
          allDay: snap.val().allDay,
          reminder: snap.val().reminder,
          description: snap.val().description,
          colour: snap.val().colour,
          attendee: snap.val().attendee,
          picture: snap.val().picture
        });
        return false;
      });
    });
    this.sharedEvents.sort(this.compare);
  }

  processAttendees(attendeesString: string): any[] {
    let attendees = [];
    var attendeesArr = attendeesString.split(',');
    for(let attendee of attendeesArr) {
      if(attendee.search('#') >= 0) {
        var attNameNum = attendee.split('#');
        attendees.push({
          email: '',
          number: attNameNum[0],
          name: attNameNum[1]
        });
      }
      else {
        attendees.push({
          email: attendee,
          number: '',
          name: ''
        });
      }
    }
    return attendees;
  }

  goToEventDetail(evtId: string): void {
    this.navCtrl.push('SharedEventDetailPage', { eventId: evtId });
  }

  checkEventOverdue(event) {
    let eventStyle = {};
    if(event.startTime.getTime() < (new Date()).getTime()) {
      eventStyle = {
        'opacity': '0.5'
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
