import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { DatabaseProvider } from '../../providers/database/database';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
/**
 * Generated class for the PersonalEventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-event-detail',
  templateUrl: 'personal-event-detail.html',
})
export class PersonalEventDetailPage {
  public currentUser: any = null;
  public currentEvent: any = {};
  public evKey = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private viewCtrl: ViewController, private dbase: DatabaseProvider, private toast: ToastController, private modalCtrl: ModalController) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
    // this.eventProvider.getPersonalEventDetail(evKey).once('value').then((evtSnapshot) => {
    //   this.currentEvent = evtSnapshot.val();
    //   this.currentEvent.id = evtSnapshot.key;
    // });
    this.evKey = this.navParams.get('eventId');
  }

  ionViewWillEnter() {
    this.loadEventDetail();
  }

  loadEventDetail() {
    this.dbase.getEventDetail(this.evKey).then((event) => {
      this.currentEvent = event;

      if(event.allDay == 'true') {
        this.currentEvent.allDay = true;
      }
      else {
        this.currentEvent.allDay = false;
      }
    });
  }

  editEvent(): void {
    // this.navCtrl.push('EditPersonalEventPage', {event: this.currentEvent});
    let modal = this.modalCtrl.create('EditPersonalEventPage', {event: this.currentEvent});
    modal.present();
    modal.onDidDismiss((newEvtId) => {
      this.evKey = newEvtId;
      if(newEvtId != 0) {
        this.loadEventDetail();
      }
    });
  }

  deleteEvent(): void {
    this.dbase.deleteEvent(this.currentEvent).then((res) => {
      this.toast.create({
        message: 'Event has been deleted.',
        duration: 2500,
        positon: 'top'
      }).present();
      this.navCtrl.pop();
    });
  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

}
