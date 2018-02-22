import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {


  constructor(private googleUser) {
    console.log('Hello AuthProvider Provider');
  }

  loginWithGoogle() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'AIzaSyBSgubyZwZIcwQsdpUWwjG8Gi9wesAqKuU',
        clientId: '296974842326-p0cqdbhkkcoqbtdodq05f0aai5vas5ma.apps.googleusercontent.com',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar"
      }).then(() => {
        var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      });
    });
  }

}
