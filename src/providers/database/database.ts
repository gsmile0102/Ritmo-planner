import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';

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

  deleteEventsDb() {
    this.sqlite.deleteDatabase({
      name: 'eventsdb.db',
      location: 'default'
    });
  }

  // addCurrentLogInUser(userId): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'users.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('CREATE TABLE IF NOT EXISTS user(rowid INTEGER PRIMARY KEY, uid TEXT)', {});
  //       db.executeSql('INSERT INTO user VALUES(NULL,?)', [userId]).then((res) => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }
  //
  // getLastLogInUser(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'users.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('CREATE TABLE IF NOT EXISTS user(rowid INTEGER PRIMARY KEY, uid TEXT)', {});
  //       db.executeSql('SELECT * FROM user ORDER BY rowid DESC LIMIT 1', {}).then((res) => {
  //         var prevUser = {};
  //         if(res.rows.item(0) == null) {
  //           prevUser = {
  //             id: 0,
  //             uid: ''
  //           }
  //         }
  //         else {
  //           prevUser = {
  //             id: res.rows.item(0).rowid,
  //             uid: res.rows.item(0).uid
  //           };
  //         }
  //         resolve(prevUser);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }

  getEventsData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        this.sqlite.create({
          name: 'eventsdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS event(rowid INTEGER PRIMARY KEY, title TEXT, startTime TEXT, endTime TEXT, allDay INTEGER, reminder INTEGER, description TEXT, colour TEXT)', {});
          db.executeSql('SELECT * FROM event ORDER BY rowid', {}).then((res) => {
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
                  description: res.rows.item(i).description,
                  colour: res.rows.item(i).colour
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

  getEventDetail(eventId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM event WHERE rowid=?', [eventId]).then((res) => {
          var retEvent = {
            id: res.rows.item(0).rowid,
            title: res.rows.item(0).title,
            startTime: res.rows.item(0).startTime,
            endTime: res.rows.item(0).endTime,
            allDay: res.rows.item(0).allDay,
            reminder: res.rows.item(0).reminder,
            description: res.rows.item(0).description,
            colour: res.rows.item(0).colour
          };
          resolve(retEvent);
        }, (err) => { reject(err); });
      });
    });
  }

  checkEventExistence(eventId): Promise<any> {
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM event WHERE rowid=?', [eventId]).then((res) => {
          if(res.rows.item(0) == null) {
            resolve(0);
          }
          else {
            resolve(1);
          }
        });
      });
    });
  }

  addEvent(event): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO event VALUES(?,?,?,?,?,?,?,?)', [event.id, event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.colour]).then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateEvent(oldEventId, event): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'eventsdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        // db.executeSql('UPDATE event SET title=?, startTime=?, endTime=?, allDay=?, reminder=?, description=? WHERE rowid=?', [event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.id]).then((res) => {
        db.executeSql('DELETE FROM event WHERE rowid=?', [oldEventId]).then((res) => {
          db.executeSql('INSERT INTO event VALUES(?,?,?,?,?,?,?,?)', [event.id, event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.colour]).then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
        });
      });
    });
  }

  deleteEvent(event): Promise<any> {
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

  // getSharedEventsData(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //       this.sqlite.create({
  //         name: 'eventsdb.db',
  //         location: 'default'
  //       }).then((db: SQLiteObject) => {
  //         db.executeSql('CREATE TABLE IF NOT EXISTS sharedEvent(rowid INTEGER PRIMARY KEY, owner TEXT, title TEXT, startTime TEXT, endTime TEXT, allDay INTEGER, reminder INTEGER, description TEXT, colour TEXT)', {});
  //         db.executeSql('SELECT * FROM sharedEvent ORDER BY rowid', {}).then(res => {
  //           let sharedEvents = [];
  //           if(res.rows.length > 0) {
  //             for(var i = 0; i < res.rows.length; i++) {
  //               sharedEvents.push({
  //                 id: res.rows.item(i).rowid,
  //                 owner: res.rows.item(i).owner,
  //                 title: res.rows.item(i).title,
  //                 startTime: res.rows.item(i).startTime,
  //                 endTime: res.rows.item(i).endTime,
  //                 allDay: res.rows.item(i).allDay,
  //                 reminder: res.rows.item(i).reminder,
  //                 description: res.rows.item(i).description,
  //                 colour: res.rows.item(i).colour
  //                 // attendee: res.rows.item(i).attendee
  //               });
  //             }
  //           }
  //           resolve(sharedEvents);
  //         }, (err) => {
  //           reject(err);
  //         });
  //       });
  //   });
  // }
  //
  // getSharedEventDetail(eventId): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('SELECT * FROM sharedEvent WHERE rowid=?', [eventId]).then(res => {
  //         var retEvent = {
  //           id: res.rows.item(0).rowid,
  //           title: res.rows.item(0).title,
  //           startTime: res.rows.item(0).startTime,
  //           endTime: res.rows.item(0).endTime,
  //           allDay: res.rows.item(0).allDay,
  //           reminder: res.rows.item(0).reminder,
  //           description: res.rows.item(0).description,
  //           colour: res.rows.item(0).colour
  //           // attendee: res.rows.item(0).attendee
  //         };
  //         resolve(retEvent);
  //       }, (err) => { reject(err); });
  //     });
  //   });
  // }
  //
  // addSharedEvent(sharedEvent): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       alert('a');
  //       db.executeSql('INSERT INTO sharedEvent VALUES(?,?,?,?,?,?,?,?,?)', [sharedEvent.id, sharedEvent.owner, sharedEvent.title, sharedEvent.startTime, sharedEvent.endTime, sharedEvent.allDay, sharedEvent.reminder, sharedEvent.description, sharedEvent.colour]).then((res) => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }
  //
  // updateSharedEvent(oldEventId, event): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       // db.executeSql('UPDATE event SET title=?, startTime=?, endTime=?, allDay=?, reminder=?, description=? WHERE rowid=?', [event.title, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.id]).then((res) => {
  //       db.executeSql('DELETE FROM sharedEvent WHERE rowid=?', [oldEventId]).then((res) => {
  //         db.executeSql('INSERT INTO sharedEvent VALUES(?,?,?,?,?,?,?,?,?,?)', [event.id, event.title, event.owner, event.startTime, event.endTime, event.allDay, event.reminder, event.description, event.colour, event.attendee]).then((res) => {
  //           resolve(res);
  //         }, (err) => {
  //           reject(err);
  //         });
  //       });
  //     });
  //   });
  // }
  //
  // deleteSharedEvent(event): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('DELETE FROM sharedEvent WHERE rowid=?', [event.id]).then((res) => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }
  //
  // addEvtAttendees(sharedEvent): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('CREATE TABLE IF NOT EXISTS event_attendee(eventId INTEGER PRIMARY KEY, attendee TEXT)', {});
  //       db.executeSql('INSERT INTO event_attendee VALUES(?,?)', [sharedEvent.id, sharedEvent.attendee]).then((res) => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }
  //
  // getAllEvtAttendees(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('CREATE TABLE IF NOT EXISTS event_attendee(eventId INTEGER PRIMARY KEY, attendee TEXT)', {});
  //       db.executeSql('SELECT * FROM event_attendee ORDER BY eventId', {}).then(res => {
  //         let evtAtt = [];
  //         if(res.rows.length > 0) {
  //           for(var i = 0; i < res.rows.length; i++) {
  //             evtAtt.push({
  //               eventId: res.rows.item(i).eventId,
  //               attendee: res.rows.item(i).attendee
  //             });
  //           }
  //         }
  //         resolve(evtAtt);
  //       }, (err) => {
  //         reject(er);
  //       });
  //     });
  //   });
  // }
  //
  // getSingleEvtAttendees(evtId): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.sqlite.create({
  //       name: 'eventsdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('SELECT * FROM event_attendee WHERE eventId=?', [evtId]).then(res => {
  //         var retEvtAtt = {
  //           eventId: res.rows.item(0).eventId,
  //           attendee: res.rows.item(0).attendee
  //         };
  //         resolve(retEvtAtt);
  //       }, (err) => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }

}
