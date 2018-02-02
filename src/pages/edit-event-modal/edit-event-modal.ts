import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
/**
 * Generated class for the EditEventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-event-modal',
  templateUrl: 'edit-event-modal.html',
})
export class EditEventModalPage {

  event = {
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    description: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    let editEvent = this.navParams.get('event');
    this.event.startTime = moment(editEvent.startTime).format();
    this.event.endTime = moment(editEvent.endTime).format();
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {

  }

}
