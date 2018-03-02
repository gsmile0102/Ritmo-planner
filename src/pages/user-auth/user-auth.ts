import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UserAuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-auth',
  templateUrl: 'user-auth.html',
})
export class UserAuthPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserAuthPage');
  }

  goToLogIn() {
    this.navCtrl.push('LoginModalPage');
    // let modal = this.modalCtrl.create('LoginModalPage');
    // modal.present();
  }

  goToSignUp() {
    this.navCtrl.push('SignUpModalPage');
    // let modal = this.modalCtrl.create('SignUpModalPage');
    // modal.present();
  }

}
