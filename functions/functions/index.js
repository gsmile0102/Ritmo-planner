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

    processTokens(attTokens).then((processedTokens) => {
      for(var token of processedTokens) {
        tokens.push(token.devToken);
      }

      var newMsg = wroteData.senderName + " invited you to join " + wroteData.evtMessage + " event. Go and check on it!";
      var updateMsg = wroteData.senderName + " has updated the " + wroteData.evtMessage + " event. Go and check on it!";

      var payload = {
        "notification": {
            "title": "RitMo",
            "body": wroteData.type === 'new' ? newMsg : updateMsg,
            "sound": "default",
        },
        "data": {
            "senderName": wroteData.senderName,
            "message": wroteData.type === 'new' ? newMsg : updateMsg, 
            "type": wroteData.type
        }
      };

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
