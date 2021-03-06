import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { Contacts } from '@ionic-native/contacts';
import { TextMaskModule } from 'angular2-text-mask';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { InputMaskModule } from 'ionic-input-mask';
import { EmailComposer } from '@ionic-native/email-composer';

import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PersonalEventListPage } from '../pages/personal-event-list/personal-event-list';
import { SharedEventListPage } from '../pages/shared-event-list/shared-event-list';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { AddUserDetailsPage } from '../pages/add-user-details/add-user-details';
import { NgCalendarModule } from 'ionic2-calendar';
import { DatabaseProvider } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { NotificationProvider } from '../providers/notification/notification';
import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { NetworkProvider } from '../providers/network/network';

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
    TabsPage,
    HomePage,
    PersonalEventListPage,
    SharedEventListPage,
    AddUserDetailsPage,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    TextMaskModule,
    IonicStorageModule.forRoot(),
    InputMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    PersonalEventListPage,
    SharedEventListPage,
    AddUserDetailsPage,
    UserProfilePage
  ],
  providers: [
    AngularFireDatabase,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLite,
    Toast,
    LocalNotifications,
    NotificationProvider,
    AuthProvider,
    EventProvider,
    Network,
    NetworkProvider,
    Contacts,
    Camera,
    FCM,
    EmailComposer
  ]
})
export class AppModule {}
