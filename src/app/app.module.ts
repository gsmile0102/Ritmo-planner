import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { AddEventPage } from '../pages/add-event/add-event';

import { NgCalendarModule } from 'ionic2-calendar';
import { DatabaseProvider } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { NotificationProvider } from '../providers/notification/notification';
import { AuthProvider } from '../providers/auth/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAiyRfL_VnIiJHU-iNWMvhL9e8XKiOSizA",
  authDomain: "planner-app-3a311.firebaseapp.com",
  databaseURL: "https://planner-app-3a311.firebaseio.com",
  projectId: "planner-app-3a311",
  storageBucket: "planner-app-3a311.appspot.com",
  messagingSenderId: "296974842326"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
    // AddEventPage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
    // AddEventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLite,
    Toast,
    LocalNotifications,
    NotificationProvider,
    AuthProvider
  ]
})
export class AppModule {}
