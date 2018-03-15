import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { NotificationProvider } from '../../providers/notification/notification';
import { EventProvider } from '../../providers/event/event';
import { Camera } from '@ionic-native/camera';

import * as moment from 'moment';
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
    reminder: "",
    description: "",
    colour: "",
    attendee: [],
    picture: null
  };

  selectedColour = '#9999ff';
  notifications = [];
  attendees = [];
  eventPic: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbase: DatabaseProvider, private eventProvider: EventProvider, private viewCtrl: ViewController, private modalCtrl: ModalController, private ntfProvider: NotificationProvider, private camera: Camera) {
    let preselectedDate = this.navParams.get('selectedDay');
    this.sharedEvent.startTime = moment(preselectedDate).format('');
    this.sharedEvent.endTime = moment(preselectedDate).format('');
    this.sharedEvent.reminder = 'ntf' + (new Date()).getTime();
    this.sharedEvent.colour = this.selectedColour;
    this.sharedEvent.owner = this.eventProvider.getCurrentUser().email;
  }

  ionViewDidLoad() {
  }

  addReminder() {
    let modal = this.modalCtrl.create('ReminderModalPage', {event: this.sharedEvent});
    modal.present();
    modal.onDidDismiss(ntf => {
      let notfObj = {
        id: Math.floor(Math.random()*20)+1,
        title: this.sharedEvent.title,
        text: ntf.text,
        at: ntf.at,
        data: { reminder: this.sharedEvent.reminder }
      };
      this.notifications.push(notfObj);
    });
  }

  removeReminder(ntftext) {
    for(var i = 0; i < this.notifications.length;  i++) {
      if(this.notifications[i].text == ntftext) {
        this.notifications.splice(i, 1);
      }
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  setColor() {
    let modal = this.modalCtrl.create('EventColorPickerPage');
    modal.present();
    modal.onDidDismiss((colour) => {
      if(colour !== '') {
        this.selectedColour = colour;
        this.sharedEvent.colour = colour;
      }
    });
  }

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
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then((imageData) => {
      this.sharedEvent.picture = imageData;
    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  attendeeArrayToString(): string {
    var arrString = '';
    if(this.attendees.length > 0) {
      if(this.attendees[0].email != '') {
        arrString += this.attendees[0].email + ',';
      }
      else {
        arrString += this.attendees[0].number + '#' + this.attendees[0].name + ',';
      }

      for(var i = 1; i < this.attendees.length; i++) {
        if(this.attendees[i].email != '') {
          arrString += ',' + this.attendees[i].email;
        }
        else {
          arrString += ',' + this.attendees[i].number + '#' + this.attendees[0].name;
        }
      }
    }

    return arrString;
  }

  saveEvent(): void {
    this.processEventDateTime().then((res) => {
      this.sharedEvent.id = (new Date()).getTime();
      this.sharedEvent.attendee = this.attendees;
      // this.newEvent.reminder = this.notifications;
      this.eventProvider.createSharedEvent(this.sharedEvent).then(res => {
        this.ntfProvider.scheduleReminder(this.notifications).then((res) => {
          this.notifications = [];
        });
        this.navCtrl.pop();
      });
    });
  }

}
