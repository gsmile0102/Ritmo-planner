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
  public sharedEventListRef: Reference;

  public currentUser: any = null;

  constructor(public db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser = user;
        this.perEventListRef = firebase.database().ref(`/personalEventList/${user.uid}`);
        this.sharedEventListRef = firebase.database().ref(`/sharedEventList`);
        this.userListRef = firebase.database().ref(`/userProfile`);
        this.eventAttListRef = firebase.database().ref(`/eventAttList`);
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
        this.perEventListRef.once('value').then((snapshot) => {
          snapshot.forEach((snap) => {
            var evtKey = snap.key;
            if(!evIdList.includes(parseInt(evtKey))) {
              this.perEventListRef.child(evtKey).remove();
            }
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
                description: event.description,
                colour: event.colour
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

  syncSharedEventData(sharedEvents: any[], attEvents: any[]): void {
  }

  createSharedEvent(sharedEvent): Promise<any> {
    return new Promise((resolve, reject) => {
      var attendee = sharedEvent.attendee;
      var addUpdates = {};
      addUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id] = {
        owner: this.currentUser.uid,
        title: sharedEvent.title,
        startTime: sharedEvent.startTime,
        endTime: sharedEvent.endTime,
        allDay: sharedEvent.allDay,
        reminder: sharedEvent.reminder,
        description: sharedEvent.description,
        colour: sharedEvent.colour
      };
      firebase.database().ref().update(addUpdates);

      for(let attendee of sharedEvent.attendee) {
        var orderField = attendee.email == '' ? 'phone' : 'email';
        var eqField = attendee.email == '' ? attendee.number : attendee.email;

        this.userListRef.orderByChild(orderField).equalTo(eqField).once('value', (snapshot) => {
          if(snapshot.exists()) {
            snapshot.forEach((snap) => {
              var attUpdates = {};
              attUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id] = {
                owner: this.currentUser.uid,
                title: sharedEvent.title,
                startTime: sharedEvent.startTime,
                endTime: sharedEvent.endTime,
                allDay: sharedEvent.allDay,
                reminder: sharedEvent.reminder,
                description: sharedEvent.description,
                colour: sharedEvent.colour
              };
              firebase.database().ref().update(attUpdates);

              var attOwnerUpdates = {};
              attOwnerUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id + '/attendee/' + snap.key] = attendee.name;
              attOwnerUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id + '/attendee/' + snap.key] = attendee.name;
              firebase.database().ref().update(attOwnerUpdates)

              var evtAttUpdates = {};
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + snap.key] = false;
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + this.currentUser.uid] = false;
              firebase.database().ref().update(evtAttUpdates);
            });
          }
        });
      }
      resolve(sharedEvent);
    });
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

  // getPersonalEventList(): Reference {
  //   return this.db.list(`/personalEventList/${this.currentUser.uid}`, ref => ref.orderByChild('startTime'));
  //   return firebase.database().ref(`/personalEventList/${this.currentEvent.uid}`);
  // }
  //
  // getPersonalEventDetail(evtId: string): Reference {
  //   return this.perEventListRef.child(evtId);
  // }
  //
  // deletePersonalEvent(evtId: string): Promise<any> {
  //   return this.perEventListRef.child(evtId).remove();
  // }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getSharedEventList(): Reference {
    return this.sharedEventListRef.child(this.currentUser.uid);
  }

  getEventAttendanceList(): Reference {
    return this.eventAttListRef;
  }

  getSharedEventDetail(eventId): Reference {
    return this.sharedEventListRef.child(this.currentUser.uid + '/' + eventId);
  }

  leaveSharedEvent(eventId, eventOwner): Promise<any> {
    return new Promise((resolve) => {
      this.shareEventListRef.child(`${this.currentUser.uid}/${eventId}`).remove().then(() => {
        this.shareEventListRef.child(`${eventOwner}/${eventId}/attendee/${this.currentUser.uid}`).remove().then(() => {
          this.eventAttListRef.child(`${eventId}/${this.currentUser.uid}`).remove().then(() => {
            resolve(eventId);
          });
        });
      });
    });
  }

  deleteSharedEvent(eventId): Promise<any> {
    return new Promise((resolve) => {
      firebase.database().ref(`eventAttList/${eventId}`).once('value').then((evtAttSnap) => {
        evtAttSnap.forEach((snap) => {
          firebase.database().ref(`sharedEventList/${snap.key}/${eventId}`).remove().then(() => {
            firebase.database().ref(`eventAttList/${eventId}/${snap.key}`).remove();
          });
        });
      });
      resolve(eventId);
    });
  }

  processAttendees(attendeesString: string) {
    var attendees = [];
    var attendeesArr = attendeesString.split(',');
    for(let attendee of attendeesArr) {
      if(attendee.search('#') >= 0) {
        var attNameNum = attendee.split('#');
        attendees.push({
          email: '',
          number: attNameNum[0],
          name: attNameNum[1]
        });
      }
      else {
        attendees.push({
          email: attendee,
          number: '',
          name: ''
        });
      }
    }
    return attendees;
  }

}
