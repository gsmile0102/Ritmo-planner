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
  public messagesListRef: Reference;
  public pushTokensListRef: Reference;

  public currentUser: any = null;
  eventOwner = {
    id: '',
    name: '',
    email: '',
    phone: '',
    profilePic: ''
  };

  constructor(public db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser = user;
        this.perEventListRef = firebase.database().ref(`/personalEventList/${user.uid}`);
        this.sharedEventListRef = firebase.database().ref(`/sharedEventList`);
        this.userListRef = firebase.database().ref(`/userProfile`);
        this.eventAttListRef = firebase.database().ref(`/eventAttList`);
        this.messagesListRef = firebase.database().ref(`/messages`);
        this.pushTokensListRef = firebase.database().ref(`/pushTokens`);
        this.userListRef.child(user.uid).once('value', (snapshot) => {
            this.eventOwner = {
              id: snapshot.key,
              name: snapshot.val().name,
              email: snapshot.val().email,
              phone: snapshot.val().phone,
              profilePic: snapshot.val().profilePic
            }
        });
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
            if(evIdList.indexOf(parseInt(evtKey)) >= 0) {
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

  createSharedEvent(sharedEvent): Promise<any> {
    return new Promise((resolve, reject) => {
      var attendee = sharedEvent.attendee;
      var existsAttList = [];

      var addUpdates = {};
      addUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id] = {
        owner: this.currentUser.uid,
        title: sharedEvent.title,
        startTime: sharedEvent.startTime,
        endTime: sharedEvent.endTime,
        allDay: sharedEvent.allDay,
        description: sharedEvent.description
      };
      firebase.database().ref().update(addUpdates);

      for(let attendee of sharedEvent.attendee) {
        var orderField = attendee.email == '' ? 'phone' : 'email';
        var eqField = attendee.email == '' ? attendee.number : attendee.email;

        this.userListRef.orderByChild(orderField).equalTo(eqField).once('value', (snapshot) => {
          if(snapshot.exists()) {
            snapshot.forEach((snap) => {
              existsAttList.push({
                id: snap.key,
                name: snap.val().name,
                email: snap.val().email,
                profilePic: snap.val().profilePic,
                pushToken: snap.val().pushToken
              });

              var attUpdates = {};
              attUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id] = {
                owner: this.currentUser.uid,
                title: sharedEvent.title,
                startTime: sharedEvent.startTime,
                endTime: sharedEvent.endTime,
                allDay: sharedEvent.allDay,
                description: sharedEvent.description
              };
              firebase.database().ref().update(attUpdates);

              if(sharedEvent.picture != null) {
                firebase.storage().ref(`sharedEventPic/${sharedEvent.id}/eventPic.png`).putString(sharedEvent.picture, 'base64', {contentType: 'image/png'}).then((savedPicture) => {
                  this.sharedEventListRef.child(`${this.currentUser.uid}/${sharedEvent.id}/picture`).set(savedPicture.downloadURL);
                  this.sharedEventListRef.child(`${snap.key}/${sharedEvent.id}/picture`).set(savedPicture.downloadURL);
                });
              }

              var ownerAttUpdates = {};
              // attUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id + '/attendee/' + snap.key] = {
              //   name: snap.val().name,
              //   email: snap.val().email,
              //   phone: snap.val().phone,
              //   profilePic: snap.val().profilePic
              // };
              ownerAttUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id + '/attendee/' + snap.key] = {
                name: snap.val().name,
                email: snap.val().email,
                // phone: snap.val().phone,
                profilePic: snap.val().profilePic
              };
              firebase.database().ref().update(ownerAttUpdates);

              var ownerUpdates = {};
              ownerUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id + '/owner/'] = {
                id: this.eventOwner.id,
                name: this.eventOwner.name,
                email: this.eventOwner.email,
                // phone: this.eventOwner.phone,
                profilePic: this.eventOwner.profilePic
              };
              ownerUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id + '/owner/'] = {
                id: this.eventOwner.id,
                name: this.eventOwner.name,
                email: this.eventOwner.email,
                // phone: this.eventOwner.phone,
                profilePic: this.eventOwner.profilePic
              };
              firebase.database().ref().update(ownerUpdates);

              var evtAttUpdates = {};
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + snap.key] = false;
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + this.currentUser.uid] = false;
              firebase.database().ref().update(evtAttUpdates);

              return false;
            });
          }
        }).then(() => {
          if(attendee == sharedEvent.attendee[sharedEvent.attendee.length - 1]) {
            for(let attendee of existsAttList) {
              var attUpdates = {};
              for(let att of existsAttList) {
                attUpdates['sharedEventList/' + att.id + '/' + sharedEvent.id + '/attendee/' + attendee.id] = {
                  name: attendee.name,
                  email: attendee.email,
                  // phone: attendee.phone,
                  profilePic: attendee.profilePic
                };
              }
              firebase.database().ref().update(attUpdates);

              this.pushTokensListRef.child(sharedEvent.id).push({
                devToken: attendee.pushToken
              });
            }
            this.messagesListRef.push({
              senderName: this.eventOwner.name,
              eventId: sharedEvent.id,
              evtMessage: sharedEvent.title,
              type: 'new'
            });
          }
        });
      }
      resolve(sharedEvent);
    });
  }

  updateSharedEvent(sharedEvent, isNewPic): Promise<any> {
    return new Promise((resolve, reject) => {
      var attendee = sharedEvent.attendee;
      var existsAttList = [];

      var addUpdates = {};
      addUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id] = {
        owner: this.currentUser.uid,
        title: sharedEvent.title,
        startTime: sharedEvent.startTime,
        endTime: sharedEvent.endTime,
        allDay: sharedEvent.allDay,
        description: sharedEvent.description
      };
      firebase.database().ref().update(addUpdates);

      for(let attendee of sharedEvent.attendee) {
        var orderField = attendee.email == '' ? 'phone' : 'email';
        var eqField = attendee.email == '' ? attendee.number : attendee.email;

        this.userListRef.orderByChild(orderField).equalTo(eqField).once('value', (snapshot) => {
          if(snapshot.exists()) {
            snapshot.forEach((snap) => {
              existsAttList.push({
                id: snap.key,
                name: snap.val().name,
                email: snap.val().email,
                // phone: snap.val().phone,
                profilePic: snap.val().profilePic,
                pushToken: snap.val().pushToken
              });

              var attUpdates = {};
              attUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id] = {
                owner: this.currentUser.uid,
                title: sharedEvent.title,
                startTime: sharedEvent.startTime,
                endTime: sharedEvent.endTime,
                allDay: sharedEvent.allDay,
                description: sharedEvent.description
              };
              firebase.database().ref().update(attUpdates);

              if(sharedEvent.picture != null && isNewPic) {
                firebase.storage().ref(`sharedEventPic/${sharedEvent.id}/eventPic.png`).putString(sharedEvent.picture, 'base64', {contentType: 'image/png'}).then((savedPicture) => {
                  this.sharedEventListRef.child(`${this.currentUser.uid}/${sharedEvent.id}/picture`).set(savedPicture.downloadURL);
                  this.sharedEventListRef.child(`${snap.key}/${sharedEvent.id}/picture`).set(savedPicture.downloadURL);
                });
              }
              if(sharedEvent.picture != null && !isNewPic) {
                firebase.storage().ref(`sharedEventPic/${sharedEvent.id}/eventPic.png`).getDownloadURL().then((url) => {
                  this.sharedEventListRef.child(`${this.currentUser.uid}/${sharedEvent.id}/picture`).set(url);
                  this.sharedEventListRef.child(`${snap.key}/${sharedEvent.id}/picture`).set(url);
                });
              }

              var ownerAttUpdates = {};
              // attUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id + '/attendee/' + snap.key] = {
              //   name: snap.val().name,
              //   email: snap.val().email,
              //   phone: snap.val().phone,
              //   profilePic: snap.val().profilePic
              // };
              ownerAttUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id + '/attendee/' + snap.key] = {
                name: snap.val().name,
                email: snap.val().email,
                // phone: snap.val().phone,
                profilePic: snap.val().profilePic
              };
              firebase.database().ref().update(ownerAttUpdates);

              var ownerUpdates = {};
              ownerUpdates['sharedEventList/' + this.currentUser.uid + '/' + sharedEvent.id + '/owner/'] = {
                id: this.eventOwner.id,
                name: this.eventOwner.name,
                email: this.eventOwner.email,
                // phone: this.eventOwner.phone,
                profilePic: this.eventOwner.profilePic
              };
              ownerUpdates['sharedEventList/' + snap.key + '/' + sharedEvent.id + '/owner/'] = {
                id: this.eventOwner.id,
                name: this.eventOwner.name,
                email: this.eventOwner.email,
                // phone: this.eventOwner.phone,
                profilePic: this.eventOwner.profilePic
              };
              firebase.database().ref().update(ownerUpdates);

              var evtAttUpdates = {};
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + snap.key] = false;
              evtAttUpdates['eventAttList/' + sharedEvent.id + '/' + this.currentUser.uid] = false;
              firebase.database().ref().update(evtAttUpdates);

              return false;
            });
          }
        }).then(() => {
          this.pushTokensListRef.child(sharedEvent.id).remove().then(() => {
            if(attendee == sharedEvent.attendee[sharedEvent.attendee.length - 1]) {
              for(let attendee of existsAttList) {
                var attUpdates = {};
                for(let att of existsAttList) {
                  attUpdates['sharedEventList/' + att.id + '/' + sharedEvent.id + '/attendee/' + attendee.id] = {
                    name: attendee.name,
                    email: attendee.email,
                    // phone: attendee.phone,
                    profilePic: attendee.profilePic
                  };
                }
                firebase.database().ref().update(attUpdates);

                this.pushTokensListRef.child(sharedEvent.id).push({
                  devToken: attendee.pushToken
                });
              }
              this.messagesListRef.push({
                senderName: this.eventOwner.name,
                eventId: sharedEvent.id,
                evtMessage: sharedEvent.title,
                type: 'update'
              });
            }
          });
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

  getPersonalEventList(): Reference {
    return this.perEventListRef;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getUserProfileList(): Reference {
    return this.userListRef;
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
      this.sharedEventListRef.child(`${this.currentUser.uid}/${eventId}`).remove().then(() => {
        this.sharedEventListRef.child(`${eventOwner}/${eventId}/attendee/${this.currentUser.uid}`).remove().then(() => {
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
