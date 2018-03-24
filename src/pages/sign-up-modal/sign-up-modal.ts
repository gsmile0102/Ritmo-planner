import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidators } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { AddUserDetailsPage } from '../add-user-details/add-user-details';
/**
 * Generated class for the SignUpModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up-modal',
  templateUrl: 'sign-up-modal.html',
})
export class SignUpModalPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authProvider: AuthProvider, public formBuilder: FormBuilder) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidators.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
  }

  save() {
    if(!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      // this.authProvider.signupWithEmail(this.signupForm.value.email, this.signupForm.value.password).then(() => {
      //   this.loading.dismiss().then(() => {
      //     // this.navCtrl.setRoot(HomePage);
      //     this.navCtrl.push('AddUserPhoneNumberPage');
      //   });
      // }, (err) => {
      //   this.loading.dismiss().then(()=> {
      //     let alert = this.alertCtrl.create({
      //       message: err.message,
      //       buttons: [
      //         {
      //           text: 'Ok',
      //           role: 'cancel'
      //         }
      //       ]
      //     });
      //     alert.present();
      //   });
      // });
      // this.loading = this.loadingCtrl.create();
      // this.loading.present();
      this.navCtrl.push(AddUserDetailsPage, {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      });
    }
  }

}
