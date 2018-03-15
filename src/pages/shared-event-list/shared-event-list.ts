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

  currentUser: any = null;
  sharedEvents = [];
  evtAtt = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private dbase: DatabaseProvider, private toast: ToastController, private network: Network, private loadingCtrl: LoadingController) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.loadEventsData();
  }

  goToCreatePersonalEvent(): void {
    this.navCtrl.push('AddEventPage', { selectedDay: new Date() });
  }

  goToCreateSharedEvent(): void {
    this.navCtrl.push('SharedEventCreatePage');
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
          allDay: snap.val().allDay == 'true' ? true : false,
          reminder: snap.val().reminder,
          description: snap.val().description,
          colour: snap.val().colour,
          attendee: snap.val().attendee
        });
      });
    });
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

  editEvent(event) {
    let modal = this.modalCtrl.create('EditSharedEventPage', {event: this.currentEvent});
    modal.present();
    modal.onDidDismiss((newEvtId) => {
      this.evKey = newEvtId;
      if(newEvtId != 0) {
        this.loadEventDetail();
      }
    });
  }

  deleteEvent(event) {
    this.dbase.deleteSharedEvent(event).then((res) => {
      this.toast.create({
        message: 'Event has been deleted.',
        duration: 2500,
        position: 'top'
      }).present();
    });
    this.loadEventsData();
  }

}
