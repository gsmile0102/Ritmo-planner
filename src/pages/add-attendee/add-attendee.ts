import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { EmailValidators } from '../../validators/email';

/**
 * Generated class for the AddAttendeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-attendee',
  templateUrl: 'add-attendee.html',
})
export class AddAttendeePage {
  public emailForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public formBuilder: FormBuilder, private viewCtrl: ViewController) {
    this.emailForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidators.isValid])]
    });
  }

  ionViewDidLoad() {
  }

  addAttendee(): void {
    if(!this.emailForm.valid) {
      console.log(this.emailForm.value);
    } else {
      this.viewCtrl.dismiss(this.emailForm.value.email);
    }
  }

  cancel() {
    this.viewCtrl.dismiss('none');
  }
}
