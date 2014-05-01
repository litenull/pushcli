var apns = require('apns');
var GCM = require('gcm').GCM;
var options, notification;

options = {
   keyFile : "PushChatKey.pem",
   certFile : "PushChatCert.pem",
   gateway: 'gateway.sandbox.push.apple.com',
   errorCallback: error,
   debug : true
};

var apiKey = '';
var gcm = new GCM(apiKey);

var error = function(error) {
  console.log(error)
}

connection = new apns.Connection(options);

var api = {
  ios: {
    sendpush: function(msg, token) {
      notification = new apns.Notification();
      notification.device = new apns.Device(token);
      notification.alert = msg;

      connection.sendNotification(notification);
    }
  },
  android: {
    sendpush: function(msg, token) {
      var message = {
        registration_id: token, // required
        collapse_key: 'Collapse key', 
          'data.key1': 'value1',
          'data.key2': 'value2'
      };

      gcm.send(message, function(err, messageId){
        if (err) {
          console.log(err);
        } else {
          console.log("Sent with message ID: ", messageId);
      }
});
    }
  }
}

exports.api = api;