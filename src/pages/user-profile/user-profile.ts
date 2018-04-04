import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';

import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  user: any = null;
  username: string = '';
  profilePic: any = null;
  email: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider, private dbase: DatabaseProvider, private alertCtrl: AlertController) {
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    firebase.database().ref(`userProfile/${this.user.uid}`).once('value', (snapshot) => {
      this.username = snapshot.val().name;
      this.email = snapshot.val().email;
      this.profilePic = snapshot.val().profilePic;
    });
  }

  logout() {
    this.authProvider.logoutUser().then(() => {
      this.authProvider.setAsLogout().then(() => {
        this.dbase.deleteEventsDb();
        this.navCtrl.setRoot('UserAuthPage');
      });
    }).catch((err) => {
      alert(err.message);
    });
  }

}
