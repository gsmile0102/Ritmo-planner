import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EventColorPickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-color-picker',
  templateUrl: 'event-color-picker.html',
})
export class EventColorPickerPage {

  eventColor: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  setColor(color: string) {
    this.eventColor = color;
    this.viewCtrl.dismiss(this.eventColor);
  }

  cancel() {
    this.viewCtrl.dismiss('');
  }

}
