import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, Loading, LoadingController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import { NotificationProvider } from '../../providers/notification/notification';

import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the EditSharedEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-shared-event',
  templateUrl: 'edit-shared-event.html',
})
export class EditSharedEventPage {

  currentUser: any = null;
  event = {
    id: 0,
    owner: "",
    title: "",
    startTime: "",
    endTime: "",
    allDay: false,
    description: "",
    attendee: [],
    picture: null
  };
  attendees = [];
  isNewPic: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,  private toast: ToastController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private dbase: DatabaseProvider, public eventProvider: EventProvider, private ntfProvider: NotificationProvider, private camera: Camera) {
    this.currentUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
    let editEvent = this.navParams.get('event');
    this.event = editEvent;
    this.event.startTime = moment(editEvent.startTime).format();
    this.event.endTime = moment(editEvent.endTime).format();
    this.attendees = this.event.attendee;
  }

  cancel() {
    this.viewCtrl.dismiss(0);
  }

  processEventDateTime(): Promise<any> {
    return new Promise((resolve, reject) => {
      let startTime = new Date(this.event.startTime);
      let endTime = new Date(this.event.endTime);
      if(this.event.allDay) {
        let daysDiff = startTime.getDate() === endTime.getDate() ? 1 : endTime.getDate() - startTime.getDate();
        let newStartTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 8, 0);
        let newEndTime = new Date(endTime.getFullYear(), endTime.getMonth(), startTime.getDate() + daysDiff, 8, 0);

        this.event.startTime = moment(newStartTime).format('');
        this.event.endTime = moment(newEndTime).format('');
      }
      else {
        this.event.startTime = moment(startTime).format('');
        this.event.endTime = moment(endTime).format('');
      }
      resolve(this.event);
    });
  }

  addAttendeeByEmail(): void {
    let modal = this.modalCtrl.create('AddAttendeePage');
    modal.present();
    modal.onDidDismiss((attendee) => {
      if(attendee != 'none') {
        this.attendees.push({
          email: attendee,
          number: '',
          name: ''
        });
      }
    });
  }

  addAttendeeFromContact(): void {
    let modal = this.modalCtrl.create('AddAttendeeFromContactPage');
    modal.present();
    modal.onDidDismiss((attendee) => {
      if(attendee != 'none') {
        if(attendee.email != null) {
          this.attendees.push({
            email: attendee.email,
            number: attendee.number,
            name: attendee.name
          });
        }
        else {
          this.attendees.push({
            email: '',
            number: attendee.number,
            name: attendee.name
          });
        }
      }
    });
  }

  removeAttendee(attendee): void {
    for(var i = 0; i < this.attendees.length; i++) {
      if(this.attendees[i] == attendee) {
        this.attendees.splice(i, 1);
      }
    }
  }

  takePicture() {
    this.camera.getPicture({
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 800,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then((imageData) => {
      this.isNewPic = true;
      this.event.picture = imageData;
    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  saveEvent(): void {
    this.processEventDateTime().then((res) => {
      let oldEventId = this.event.id;
      this.eventProvider.updateSharedEvent(this.event, this.isNewPic).then((res) => {
        this.viewCtrl.dismiss(this.event.id);
      });
    });
  }

}
