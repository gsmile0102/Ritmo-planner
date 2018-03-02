import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private navCtrl: NavController, private navParams: NavParams, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  goToLogIn() {
    let modal = this.modalCtrl.create('LogInModalPage');
    modal.present();
  }

  goToSignUp() {
    let modal = this.modalCtrl.create('SignUpModalPage');
    modal.present();
  }

}
