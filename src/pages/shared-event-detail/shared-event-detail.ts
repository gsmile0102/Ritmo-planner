import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home'

import { EventProvider } from '../../providers/event/event';
import { DatabaseProvider } from '../../providers/database/database';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/**
 * Generated class for the SharedEventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shared-event-detail',
  templateUrl: 'shared-event-detail.html',
})
export class SharedEventDetailPage {
  loading: Loading;

  currentUser: any = null;
  currentEvent: any = {};
  eventOwner = {};
  attendees = [];
  isOwner: boolean = false;
  shEvRef: AngularFireList<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private viewCtrl: ViewController, private dbase: DatabaseProvider, private toast: ToastController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
    this.loadSharedEventDetail();
  }

  loadSharedEventDetail() {
      this.eventProvider.getSharedEventDetail(this.navParams.get('eventId')).once('value', (snapshot) => {
        this.currentEvent = snapshot.val();
        this.currentEvent.id = snapshot.key;
        for(let key in this.currentEvent.attendee) {
          this.attendees.push(this.currentEvent.attendee[key]);
        }
        this.eventOwner = {
          id: this.currentEvent.owner['id'],
          name: this.currentEvent.owner['name'],
          profilePic: this.currentEvent.owner['profilePic']
        };
        this.currentEvent.attendee = this.attendees;
        this.isOwner = this.currentEvent.owner['id'] == this.currentUser.uid ? true : false;
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
  }

  addReminder() {

  }

  addToCalendar() {
    let event = {
      id: this.currentEvent.id,
      title: this.currentEvent.title,
      startTime: this.currentEvent.startTime,
      endTime: this.currentEvent.endTime,
      allDay: this.currentEvent.allDay,
      reminder: this.currentEvent.reminder,
      description: this.currentEvent.description,
      colour: this.currentEvent.colour
    };
    this.dbase.addEvent(event).then((res) => {
      this.toast.create({
        message: 'Event has been added into your calendar.',
        duration: 2500,
        position: 'top'
      }).present();
    });
  }

  leave(): void {
    // this.dbase.deleteSharedEvent(event).then((res) => {
    //   this.toast.create({
    //     message: 'You have left this event.',
    //     duration: 2000,
    //     position: 'top'
    //   }).present();
    //   this.navCtrl.pop();
    // });
    this.eventProvider.leaveSharedEvent(this.currentEvent.id, this.eventOwner.id).then((res) => {
      this.toast.create({
        message: 'You have left this event.',
        duration: 2000,
        position: 'top'
      }).present();
      this.navCtrl.pop();
    });
  }

  editEvent(): void {

  }

  deleteEvent(): void {
    // this.dbase.deleteSharedEvent(event).then((res) => {
    //   this.toast.create({
    //     message: 'Event has been deleted.',
    //     duration: 2500,
    //     position: 'top'
    //   }).present();
    //   this.navCtrl.pop();
    // });
    this.eventProvider.deleteSharedEvent(this.currentEvent.id).then((res) => {
      this.toast.create({
        message: 'Event has been deleted.',
        duration: 2000,
        position: 'top'
      }).present();
      this.navCtrl.pop();
    });
  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

  processAttendees(attendeesString: string) {
    var attendees = [];
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

  generateArray(obj) {
    return Object.keys(obj).map((key)=>{ return obj[key] });
  }

}
