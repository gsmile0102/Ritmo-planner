import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { UserAuthPage } from '../pages/user-auth/user-auth';

import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';

import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') nav: NavController
  rootPage:any;
  user: any = null;
  username: string = '';
  profilePic: any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authProvider: AuthProvider, private dbase: DatabaseProvider, private fcm: FCM) {
    firebase.initializeApp({
      apiKey: "AIzaSyDLmhXONfVqA9WpIQUtViFVIBy4xlBM3y4",
      authDomain: "ritmo-planner.firebaseapp.com",
      databaseURL: "https://ritmo-planner.firebaseio.com",
      projectId: "ritmo-planner",
      storageBucket: "ritmo-planner.appspot.com",
      messagingSenderId: "686969780704"
    });
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if(!user) {
        this.rootPage = 'UserAuthPage';
        // unsubscribe();

      } else {
        this.rootPage = TabsPage;
        // unsubscribe();
        firebase.database().ref(`userProfile/${user.uid}`).once('value', (snapshot) => {
          this.username = snapshot.val().name;
          this.profilePic = snapshot.val().profilePic;
        });
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  login() {
    this.nav.push(UserAuthPage);
  }

  logout() {
    this.authProvider.logoutUser().then(() => {
      this.authProvider.setAsLogout().then(() => {
        this.dbase.deleteEventsDb();
        this.nav.setRoot('UserAuthPage');
      });
    }).catch((err) => {
      alert(err.message);
    });
  }

  getUserProfilePicture() {

  }

  goToHome() {
    this.rootPage = TabsPage;
  }

  // logout() {
  //   this.afAuth.auth.signOut().then(data => {
  //     console.log(data);
  //   }).catch(err => {
  //     alert(err.message);
  //   })
  // }
}
