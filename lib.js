var Q = require('q');
var apns = require('apns');
var GCM = require('gcm').GCM;
var config = require('./config').options;
var options, notification;


options = {
   keyFile : config.keyFile,
   certFile : config.certFile,
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
    sendpush: function(msg, token) {
      var deferred = Q.defer();      
      notification = new apns.Notification();
      notification.device = new apns.Device(token);
      notification.alert = msg;
      connection.sendNotification(notification);
      process.nextTick(function() {
        deferred.resolve();
      });
      return deferred.promise;
    }
  },
  android: {
    sendpush: function(msg, token) {
      var deferred = Q.defer();
      var message = {
        registration_id: token, // required
        collapse_key: 'Collapse key', 
        'data.key1': 'value1',
        'data.key2': 'value2',
        "delay_while_idle" : true,
        "data.message": msg
      };

      gcm.send(message, function(err, messageId){
        if (err) {
          console.log(err);
          deferred.reject(err);
        } else {
          console.log("Sent with message ID: ", messageId);
          deferred.resolve(messageId);
        }
      });
      return deferred.promise;
    }
  }
}

exports.api = api;
