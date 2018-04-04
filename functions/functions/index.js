const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

var wroteData;

exports.PushTrigger = functions.database.ref('/messages/{messageId}').onWrite((event) => {
  wroteData = event.data.val();

  admin.database().ref(`/pushTokens/${wroteData.eventId}`).once('value').then((allTokens) => {
    var attTokens = allTokens.val();
    var tokens = [];
    var payload = {};

    processTokens(attTokens).then((processedTokens) => {
      for(var token of processedTokens) {
        tokens.push(token.devToken);
      }

      var newMsg = wroteData.senderName + " invited you to join " + wroteData.evtMessage + " event. Go and check on it!";
      var updateMsg = wroteData.senderName + " has updated the " + wroteData.evtMessage + " event. Go and check on it!";
      var leaveMsg = wroteData.senderName + " has left the " + wroteData.evtMessage + " event.";
      var deleteMsg = wroteData.senderName + " has canceled the " + wroteData.evtMessage + " event.";

      if(wroteData.type === 'new') {
        payload = {
          "notification": {
              "title": "RitMo",
              "body": newMsg,
              "sound": "default",
          },
          "data": {
              "senderId": wroteData.senderId,
              "senderName": wroteData.senderName,
              "message": newMsg,
              "type": wroteData.type
          }
        };
      }
      if(wroteData.type === 'update') {
        payload = {
          "notification": {
              "title": "RitMo",
              "body": updateMsg,
              "sound": "default",
          },
          "data": {
              "senderId": wroteData.senderId,
              "senderName": wroteData.senderName,
              "message": updateMsg,
              "type": wroteData.type
          }
        };
      }
      if(wroteData.type === 'leave') {
        payload = {
          "notification": {
              "title": "RitMo",
              "body": leaveMsg,
              "sound": "default",
          },
          "data": {
              "senderId": wroteData.senderId,
              "senderName": wroteData.senderName,
              "message": leaveMsg,
              "type": wroteData.type
          }
        };
      }
      if(wroteData.type === 'delete') {
        payload = {
          "notification": {
              "title": "RitMo",
              "body": deleteMsg,
              "sound": "default",
          },
          "data": {
              "senderId": wroteData.senderId,
              "senderName": wroteData.senderName,
              "message": deleteMsg,
              "type": wroteData.type
          }
        };
      }

      return admin.messaging().sendToDevice(tokens, payload).then((response) => {
        console.log('Pushed notifications');
        return null;
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
    return null;
  }).catch((err) => {
    console.log(err);
  });
});

function processTokens(tokens) {
  var promise = new Promise((resolve, reject) => {
    var processedTokens = [];
    for(var token in tokens) {
      processedTokens.push(tokens[token]);
    }
    resolve(processedTokens);
  });
  return promise;
}
