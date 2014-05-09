var apns = require('apns');
var GCM = require('gcm').GCM;
var config = require('./config').options;
var options, notification;

options = {
   keyFile : config.keyFile,
   certFile : config.certFile,
   passphrase: config.passphrase,
   gateway: config.gateway,
   errorCallback: error,
   debug : true
};

var apiKey = config.apiKey;
var gcm = new GCM(apiKey);

var error = function(error) {
  console.log(error)
}

connection = new apns.Connection(options);

var api = {
  ios: {
    sendpush: function(msg, token, callback) {
      if (typeof callback === 'undefined') {
        callback = function() {};
      }
      notification = new apns.Notification();
      notification.device = new apns.Device(token);
      notification.alert = msg;
      connection.sendNotification(notification);
      process.nextTick(function() {
        callback({'success': 'ios msg sent'});
      });
    }
  },
  android: {
    sendpush: function(msg, token, callback) {
      if (typeof callback === 'undefined') {
        callback = function() {};
      }
      var message = {
        registration_id: token, // required
        collapse_key: 'Collapse key', 
        'data.key1': 'value1',
        'data.key2': 'value2',
        "delay_while_idle" : true,
        "data.message": msg
      };

            
      // setTimeout(function() {
      //   console.log("fake sending " + msg + " to " + token);
      //   callback({'success': 'fake sent'});
      // }, 2500);
      
     
      gcm.send(message, function(err, messageId){
        if (err) {
          console.log(err);
          callback({'error': err});
          } else {
          callback({'success': messageId});
          console.log("Sent with message ID: ", messageId);
        }
      });
    }
  }
}

exports.api = api;
