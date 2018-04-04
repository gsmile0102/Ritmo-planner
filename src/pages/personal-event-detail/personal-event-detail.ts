import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { DatabaseProvider } from '../../providers/database/database';
import * as firebase from 'firebase';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider, private viewCtrl: ViewController, private dbase: DatabaseProvider, private alertCtrl: AlertController, private toast: ToastController, private modalCtrl: ModalController) {
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
      this.currentEvent.allDay = event.allDay == 'true' ? true : false;
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
    let alert = this.alertCtrl.create({
      title: 'Delete this event?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dbase.deleteEvent(this.currentEvent).then((res) => {
              this.toast.create({
                message: 'Event has been deleted.',
                duration: 2500,
                position: 'top'
              }).present();
              this.navCtrl.pop();
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

  setStyle(evtColour) {
    let eventStyle = {};
    if(evtColour == '#cc0099') {
      eventStyle = {
        'background' : '#cc0099'
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

  cancel(): void {
    this.viewCtrl.dismiss();
  }

}
