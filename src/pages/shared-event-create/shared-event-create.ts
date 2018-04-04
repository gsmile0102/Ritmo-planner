import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { NotificationProvider } from '../../providers/notification/notification';
import { EventProvider } from '../../providers/event/event';
import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';

import * as moment from 'moment';
import * as firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the SharedEventCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shared-event-create',
  templateUrl: 'shared-event-create.html',
})
export class SharedEventCreatePage {

  sharedEvent = {
    id: 0,
    owner: "",
    title: "",
    startTime: "",
    endTime: "",
    allDay: false,
    // reminder: "",
    description: "",
    // colour: "",
    attendee: [],
    picture: null
  };

  selectedColour = '#9999ff';
  attendees = [];
  eventPic: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbase: DatabaseProvider, private eventProvider: EventProvider, private viewCtrl: ViewController, private toast: ToastController, private modalCtrl: ModalController, private alertCtrl: AlertController, private ntfProvider: NotificationProvider, private camera: Camera, private emailComposer: EmailComposer) {
    firebase.auth().onAuthStateChanged((user) => {
      this.sharedEvent.owner = user.email;
    });
    let preselectedDate = this.navParams.get('selectedDay');
    this.sharedEvent.startTime = moment(preselectedDate).format('');
    this.sharedEvent.endTime = moment(preselectedDate).format('');
    // this.sharedEvent.reminder = 'ntf' + (new Date()).getTime();
    // this.sharedEvent.colour = this.selectedColour;
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  // setColor() {
  //   let modal = this.modalCtrl.create('EventColorPickerPage');
  //   modal.present();
  //   modal.onDidDismiss((colour) => {
  //     if(colour !== '') {
  //       this.selectedColour = colour;
  //       this.sharedEvent.colour = colour;
  //     }
  //   });
  // }

  processEventDateTime(): Promise<any> {
    return new Promise((resolve, reject) => {
      let startTime = new Date(this.sharedEvent.startTime);
      let endTime = new Date(this.sharedEvent.endTime);
      if(this.sharedEvent.allDay) {
        let daysDiff = startTime.getDate() === endTime.getDate() ? 1 : endTime.getDate() - startTime.getDate();
        let newStartTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 8, 0);
        let newEndTime = new Date(endTime.getFullYear(), endTime.getMonth(), startTime.getDate() + daysDiff, 8, 0);

        this.sharedEvent.startTime = moment(newStartTime).format('');
        this.sharedEvent.endTime = moment(newEndTime).format('');
      }
      else {
        this.sharedEvent.startTime = moment(startTime).format('');
        this.sharedEvent.endTime = moment(endTime).format('');
      }
      resolve(this.sharedEvent);
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

  addEmailFromContact(): void {
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
          // this.attendees.push({
          //   email: '',
          //   number: attendee.number,
          //   name: attendee.name
          // });
          let alert = this.alertCtrl.create({
            title: 'Email not found',
            message: 'No email address found in this contact. Please add email detail to the contact.',
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          });
          alert.present();
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
      this.sharedEvent.picture = imageData;
    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  // attendeeArrayToString(): string {
  //   var arrString = '';
  //   if(this.attendees.length > 0) {
  //     if(this.attendees[0].email != '') {
  //       arrString += this.attendees[0].email + ',';
  //     }
  //     else {
  //       arrString += this.attendees[0].number + '#' + this.attendees[0].name + ',';
  //     }
  //
  //     for(var i = 1; i < this.attendees.length; i++) {
  //       if(this.attendees[i].email != '') {
  //         arrString += ',' + this.attendees[i].email;
  //       }
  //       else {
  //         arrString += ',' + this.attendees[i].number + '#' + this.attendees[0].name;
  //       }
  //     }
  //   }
  //
  //   return arrString;
  // }

  addToCalendar() {
    let event = {
      id: this.sharedEvent.id,
      title: this.sharedEvent.title,
      startTime: this.sharedEvent.startTime,
      endTime: this.sharedEvent.endTime,
      allDay: this.sharedEvent.allDay,
      reminder: '',
      description: this.sharedEvent.description,
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
        body: this.sharedEvent.owner + ' invited you to join ' + this.sharedEvent.title + '.<br><br>'
                + 'From: ' + moment(this.sharedEvent.startTime).format('LLLL') + '<br>'
                + 'To: ' + moment(this.sharedEvent.endTime).format('LLLL'),
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
        this.sharedEvent.id = (new Date()).getTime();
        this.sharedEvent.attendee = this.attendees;
        // this.newEvent.reminder = this.notifications;
        this.eventProvider.createSharedEvent(this.sharedEvent).then((notExistsAtts) => {
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
