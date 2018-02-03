import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
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
    id: 0,
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    description: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private dbase: DatabaseProvider) {
    let editEvent = this.navParams.get('event');
    this.event.id = editEvent.id;
    this.event.title = editEvent.title;
    this.event.startTime = moment(editEvent.startTime).format();
    this.event.endTime = moment(editEvent.endTime).format();
    this.event.allDay = editEvent.allDay;
    this.event.description = editEvent.description;
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.dbase.editEvent(this.event).then((res) => {
      this.viewCtrl.dismiss(res);
    });
  }

}
