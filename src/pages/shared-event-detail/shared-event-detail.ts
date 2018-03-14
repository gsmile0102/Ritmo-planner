import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
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
  currentUser: any = null;
  currentEvent: any = {};
  isOwner: boolean = false;
  shEvRef: AngularFireList<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private viewCtrl: ViewController, private dbase: DatabaseProvider, private toast: ToastController, private modalCtrl: ModalController, private db: AngularFireDatabase) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
    this.loadSharedEventDetail();
  }

  loadSharedEventDetail() {
    this.eventProvider.getSharedEventDetail(this.navParams.get('eventId')).once('value', (snapshot) => {
      this.currentEvent = snapshot.val();
      this.currentEvent.id = snapshot.key;
      var attendees = [];
      for(let key in this.currentEvent.attendee) {
        attendees.push(this.currentEvent.attendee[key]);
      }
      this.currentEvent.attendee = attendees;
      this.isOwner = this.currentEvent.owner == this.currentUser.uid ? true : false;
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
    this.eventProvider.leaveSharedEvent(this.currentEvent.id, this.currentEvent.owner).then((res) => {
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
    this.dbase.deleteSharedEvent(event).then((res) => {
      this.toast.create({
        message: 'Event has been deleted.',
        duration: 2500,
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
