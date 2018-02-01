import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  private database: SQLiteObject;
  private dbReady: boolean;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
      });
    });
  }

  getEventsData() {
    return new Promise((resolve, reject) => {
        this.sqlite.create({
          name: 'eventsdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS event(rowid INTEGER PRIMARY KEY, title TEXT, startTime TEXT, endTime TEXT, allDay INTEGER, description TEXT)', {});
          db.executeSql('SELECT * FROM event ORDER BY rowid', {}).then(res => {
            let events = [];
            if(res.rows.length > 0) {
              for(var i = 0; i < res.rows.length; i++) {
                events.push({
                  id: res.rows.item(i).rowid,
                  title: res.rows.item(i).title,
                  startTime: res.rows.item(i).startTime,
                  endTime: res.rows.item(i).endTime,
                  allDay: res.rows.item(i).allDay,
                  description: res.rows.item(i).description
                });
              }
            }
            resolve(events);
          }, (err) => {
            reject(err);
          });
        });
    });
  }

  addEvent(event) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO event VALUES(NULL,?,?,?,?,?)', [event.title, event.startTime, event.endTime, event.allDay, event.description]).then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  editEvent() {

  }

  deleteEvent() {

  }

}
