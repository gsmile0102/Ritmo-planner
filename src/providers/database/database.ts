import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  // private database: SQLiteObject;
  // private databaseReady: BehaviorSubject<boolean>;

  constructor(private sqlite: SQLite) {
    // this.databaseReady = new BehaviorSubject(false);
    // this.platform.ready().then(() => {
    //   this.sqlite.create({
    //     name: 'eventsdb.db',
    //     location: 'default'
    //   }).then((db: SQLiteObject) => {
    //     this.database = db;
    //     db.executeSql('CREATE TABLE IF NOT EXISTS event(rowid INTEGER PRIMARY KEY, title TEXT, startTime TEXT, endTime TEXT, allDay INTEGER, description TEXT)', {});
    //     this.databaseReady.next(true);
    //   });
    // });
  }

  deleteDb() {
    this.sqlite.deleteDatabase({
      name: 'eventsdb.db',
      location: 'default'
    });
  }

  getEventsData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        this.sqlite.create({
          name: 'eventsdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS event(rowid INTEGER PRIMARY KEY, title TEXT, startTime TEXT, endTime TEXT, allDay INTEGER, reminder INTEGER, description TEXT)', {});
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
                  reminder: res.rows.item(i).reminder,
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

  // getSingleEvent(event) {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('SELECT * FROM event WHERE rowid=?', [event.id]).then(res => {
  //         let retEvent = {
  //           id: res.rows.item(0).rowid,
  //           title: res.rows.item(0).title,
  //           startTime: res.rows.item(0).startTime,
  //           endTime: res.rows.item(0).endTime,
  //           allDay: res.rows.item(0).allDay,
  //           reminder: res.rows.item(0).reminder,
  //           description: res.rows.item(0).description
  //         };
  //       });
  //     });
  //     resolve(retEvent);
  //   }, (err) => {
  //     reject(err);
  //   });
  // }

  addEvent(event) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO event VALUES(NULL,?,?,?,?,?,?)', [event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description]).then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateEvent(event) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('UPDATE event SET title=?, startTime=?, endTime=?, allDay=?, reminder=?, description=? WHERE rowid=?', [event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.id]).then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  deleteEvent(event) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM event WHERE rowid=?', [event.id]).then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
      });
    })
  }

  // getDatabaseState() {
  //   return this.databaseReady.asObservable();
  // }

}
