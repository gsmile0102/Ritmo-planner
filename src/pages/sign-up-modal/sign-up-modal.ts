import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidators } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
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
    //form validators
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidators.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  save() {
    if(!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.navCtrl.push(AddUserDetailsPage, {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      });
    }
  }

  ionViewDidLoad() {
  }
}
