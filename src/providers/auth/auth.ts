import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor() {
  }

  // loginWithGoogle() {
  //   gapi.load('client:auth2', () => {
  //     gapi.client.init({
  //       apiKey: 'AIzaSyBSgubyZwZIcwQsdpUWwjG8Gi9wesAqKuU',
  //       clientId: '296974842326-p0cqdbhkkcoqbtdodq05f0aai5vas5ma.apps.googleusercontent.com',
  //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  //       scope: "https://www.googleapis.com/auth/calendar"
  //     }).then(() => {
  //         console.log('load2');
  //         gapi.auth2.getAuthInstance().signIn().then(function _firebaseSignIn(googleUser){
  //           console.log('Google Auth Response', googleUser);
  //           // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  //           var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
  //             unsubscribe();
  //             // Check if we are already signed-in Firebase with the correct user.
  //             if (!_isUserEqual(googleUser, firebaseUser)) {
  //               // Build Firebase credential with the Google ID token.
  //               var credential = firebase.auth.GoogleAuthProvider.credential(
  //                   googleUser.getAuthResponse().id_token);
  //               // Sign in with credential from the Google user.
  //               firebase.auth().signInWithCredential(credential).catch(function(error) {
  //
  //               });
  //               console.log('success');
  //             } else {
  //               console.log('User already signed-in Firebase.');
  //             }
  //
  //             function _isUserEqual(googleUser, firebaseUser) {
  //               if (firebaseUser) {
  //                 var providerData = firebaseUser.providerData;
  //                 for (var i = 0; i < providerData.length; i++) {
  //                   if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
  //                       providerData[i].uid === googleUser.getBasicProfile().getId()) {
  //                     // We don't need to reauth the Firebase connection.
  //                     return true;
  //                   }
  //                 }
  //               }
  //               return false;
  //             }
  //           });
  //         }).catch((error) => {
  //
  //         });
  //       });
  //   });
  // }

  loginInWithEmail(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupWithEmail(email: string, password: string, phone: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email,
        phone: phone
      });
    });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }



}
