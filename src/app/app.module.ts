import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { AddEventPage } from '../pages/add-event/add-event';

import { NgCalendarModule } from 'ionic2-calendar';
import { DatabaseProvider } from '../providers/database/database';

import { SQLite } from '@ionic-native/sqlite';
import { NotificationProvider } from '../providers/notification/notification';

@NgModule({
  declarations: [
    MyApp,
    HomePage
    // AddEventPage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp)
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
    NotificationProvider
  ]
})
export class AppModule {}
