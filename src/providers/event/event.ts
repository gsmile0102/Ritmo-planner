import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Reference, ThenableReference } from '@firebase/database-types';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {
  public perEventListRef: Reference;
  public userListRef: Reference;
  public eventAttListRef: Reference;

  public currentUser: any = null;

  constructor(public db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser = user;
        this.perEventListRef = firebase.database().ref(`/personalEventList/${user.uid}`);
        this.userListRef = firebase.database().ref(`/userProfile`);
      }
    });
  }

  syncEventsData(events: any[]): void {
    let evIdList = [];
    for(let event of events) {
      evIdList.push(event.id);
    }
    if(events.length > 0) {
      for(let event of events) {
        // this.perEventListRef.child(event.id).once('value', (snapshot) => {
        //   var evtKey = snapshot.key;
        //   if (!snapshot.exists() ) {
        //     var evtUpdates = {};
        //     evtUpdates['personalEventList/' + this.currentUser.uid + '/' + event.id] = {
        //       title: event.title,
        //       startTime: event.startTime,
        //       endTime: event.endTime,
        //       allDay: event.allDay,
        //       reminder: event.reminder,
        //       description: event.description
        //     };
        //     firebase.database().ref().update(evtUpdates);
        //   }
        //   if(evtKey.includes())
        // });
        this.perEventListRef.once('value', (snapshot) => {
          snapshot.forEach((snap) => {
            var evtKey = snap.key;
            if(!evIdList.includes(parseInt(evtKey))) {
              this.perEventListRef.child(evtKey).remove();
            }
            // if((event.id !== evtKey) && !(evIdList.includes(parseInt(evtKey)))) {
            //   var evtUpdates = {};
            //   evtUpdates['personalEventList/' + this.currentUser.uid + '/' + event.id] = {
            //     title: event.title,
            //     startTime: event.startTime,
            //     endTime: event.endTime,
            //     allDay: event.allDay,
            //     reminder: event.reminder,
            //     description: event.description
            //   };
            //   firebase.database().ref().update(evtUpdates);
            // }
          });
        }).then((res) => {
          this.perEventListRef.child(event.id).once('value', (snapshot) => {
            if(!snapshot.exists()) {
              var evtUpdates = {};
              evtUpdates['personalEventList/' + this.currentUser.uid + '/' + event.id] = {
                title: event.title,
                startTime: event.startTime,
                endTime: event.endTime,
                allDay: event.allDay,
                reminder: event.reminder,
                description: event.description
              };
              firebase.database().ref().update(evtUpdates);
            }
          });
        });
      }
    }
    else {
      this.perEventListRef.remove();
    }
  }

  createPersonalEvent(newEvent: any): ThenableReference {
    return this.perEventListRef.push({
      title: newEvent.title,
      startTime: new Date(newEvent.startTime).getTime(),
      endTime: new Date(newEvent.endTime).getTime(),
      allDay: newEvent.allDay,
      reminder: newEvent.reminder,
      description: newEvent.description
    });
  }

  getPersonalEventList(): Reference {
    return this.db.list(`/personalEventList/${this.currentUser.uid}`, ref => ref.orderByChild('startTime'));
    // return firebase.database().ref(`/personalEventList/${this.currentEvent.uid}`);
  }

  getPersonalEventDetail(evtId: string): Reference {
    return this.perEventListRef.child(evtId);
  }

  deletePersonalEvent(evtId: string): Promise<any> {
    return this.perEventListRef.child(evtId).remove();
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

}
