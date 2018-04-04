import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, ToastController, Loading, LoadingController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { EventProvider } from '../../providers/event/event';
import { NotificationProvider } from '../../providers/notification/notification';
import { EmailComposer } from '@ionic-native/email-composer';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,  private toast: ToastController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private dbase: DatabaseProvider, public eventProvider: EventProvider, private ntfProvider: NotificationProvider, private camera: Camera, private emailComposer: EmailComposer, private alertCtrl: AlertController) {
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

  addToCalendar() {
    let event = {
      id: this.event.id,
      title: this.event.title,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
      allDay: this.event.allDay,
      reminder: '',
      description: this.event.description,
      colour: '#cc0099'
    };
    this.dbase.addEvent(event).then((res) => {
      this.toast.create({
        message: 'Event has been added into your calendar.',
        duration: 2500,
        position: 'top'
      }).present();
    });
  }

  sendByEmail(attList: string[]): Promise<any> {
      let email = {
        to: attList,
        // attachments: [
        //   this.sharedEvent.picture
        // ],
        subject: 'Ritmo: Event Invitation',
        body: this.event.owner + ' invited you to join ' + this.event.title + '.<br><br>'
                + 'From: ' + moment(this.event.startTime).format('LLLL') + '<br>'
                + 'To: ' + moment(this.event.endTime).format('LLLL'),
        isHtml: true
      };

      return this.emailComposer.open(email);
  }

  promptAddToCal(): void {
    let alert = this.alertCtrl.create({
      title: 'Add to calendar?',
      message: 'Do you want to add this event to calendar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.saveEvent();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.saveEvent().then((res) => {
              this.addToCalendar();
            });
          }
        }
      ]
    });
    alert.present();
  }

  promptSendEmail(notExistsAtts: string[]): void {
    let alert = this.alertCtrl.create({
      title: 'User not exists.',
      subTitle: 'Do you want send the event through email?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.sendByEmail(notExistsAtts).then(() => {
              this.viewCtrl.dismiss();
            });
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  saveEvent(): Promise<any> {
    return new Promise((resolve) => {
      this.processEventDateTime().then((res) => {
        this.eventProvider.updateSharedEvent(this.event, this.isNewPic).then((notExistsAtts) => {
          if(notExistsAtts.length > 0) {
            this.promptSendEmail(notExistsAtts);
          }
          else {
            this.viewCtrl.dismiss();
          }
          resolve(res);
        });
      });
    });

  }

}
