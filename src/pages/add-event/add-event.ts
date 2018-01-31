import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the AddEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {

  event = {
    title: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    description: ""
  };

  constructor(private navCtrl: NavController, private navParams: NavParams, private dbase: DatabaseProvider) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.navCtrl.popToRoot();
  }

  save() {
    this.dbase.addEvent(this.event).then(res => {
      this.navCtrl.popToRoot();
    });
  }

}
