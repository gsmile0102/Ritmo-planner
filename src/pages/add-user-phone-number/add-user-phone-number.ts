import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddUserPhoneNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user-phone-number',
  templateUrl: 'add-user-phone-number.html'
})
export class AddUserPhoneNumberPage {
  marks: any;

  phoneNumber: any = "";
  email = '';
  password = '';

  public loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authProvider: AuthProvider) {
    this.marks = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.email = this.navParams.get('email');
    this.password = this.navParams.get('password');
  }

  ionViewDidLoad() {
  }

  signupUser() {
    let unmaskedData = {
      phoneNumber: this.phoneNumber.replace(/\D+/g, '')
    };

    this.authProvider.signupWithEmail(this.email, this.password, unmaskedData.phoneNumber).then(() => {
      this.loading.dismiss().then(() => {
        this.navCtrl.setRoot(HomePage);
      });
    }, (err) => {
      this.loading.dismiss().then(()=> {
        let alert = this.alertCtrl.create({
          message: err.message,
          buttons: [
            {
              text: 'Ok',
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

}
