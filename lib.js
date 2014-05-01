var apns = require('apns');
var options;

options = {
   keyFile : "PushChatKey.pem",
   certFile : "PushChatCert.pem",
   errorCallback: error,
   debug : true
};

connection = new apns.Connection(options);

var error = function(error) {
  console.log(error)
}

var api = {
  ios: {
    sendpush: function(msg, token) {
      notification = new apns.Notification();
      notification.device = new apns.Device(token);
      notification.alert = msg;

      console.log('Notification sent');
    }
  }
}

exports.api = api;