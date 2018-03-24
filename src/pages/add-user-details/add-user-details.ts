import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Camera } from '@ionic-native/camera';

import { AuthProvider } from '../../providers/auth/auth';

import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AddUserDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user-details',
  templateUrl: 'add-user-details.html',
})
export class AddUserDetailsPage {
  public userProfileForm: FormGroup;
  public loading: Loading;

  email = '';
  password = '';
  profilePic = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authProvider: AuthProvider, public formBuilder: FormBuilder, public camera: Camera) {
    this.userProfileForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.email = this.navParams.get('email');
    this.password = this.navParams.get('password');
  }

  takeProfilePicture() {
    this.camera.getPicture({
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then((imageData) => {
      this.profilePic = imageData;
    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  signup() {
    if(!this.userProfileForm.valid) {
      console.log(this.userProfileForm.value);
    }
    else {
      this.authProvider.signupWithEmail(this.email, this.password, this.userProfileForm.value.name, this.profilePic).then(() => {
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(TabsPage);
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

}
