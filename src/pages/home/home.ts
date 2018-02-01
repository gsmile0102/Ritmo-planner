import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from 'moment';
import { AddEventPage } from '../add-event/add-event';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  eventSource = [];
  viewTitle: string;
  isToday: boolean;
  selectedDay = new Date();
  // dbReady: boolean;

  calendar = {
      mode: 'month',
      currentDate: new Date()
  };

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private dbase: DatabaseProvider) {
    // this.dbase.getDatabaseState().subscribe(rdy => {
    //   this.dbReady = rdy;
    // });
  }

  ionViewDidLoad() {
      this.loadEventsData();

  }

  ionViewWillEnter() {
      this.loadEventsData();
  }

  loadEventsData() {
    this.dbase.getEventsData().then(res => {
      let events = this.eventSource;
        for(let ev of res) {
          let eventData = ev;

          eventData.startTime = new Date(ev.startTime);
          eventData.endTime = new Date(ev.endTime);

          events.push(eventData);
        }
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        })
    });
  }

  addEvent() {
    this.navCtrl.push(AddEventPage);
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onCurrentDateChanged(event: Date){
    var today = new Date();
    today.setHours(0,0,0,0);
    event.setHours(0,0,0,0);
    this.isToday = today.getTime() === event.getTime();
  }

}
