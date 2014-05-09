var UserApp = require('userapp');
var secrets = require('./userapp_config').secrets;
var api = require('./lib').api;
var util = require('util');
var async = require('async');
var argv = require('optimist')
    .usage('Usage: $0 --priority [int]')
    .demand(['priority'])
    .argv;
var priority = parseInt(argv.priority);

UserApp.initialize({app_id:secrets.app_id});
UserApp.setAppId(secrets.app_id);
UserApp.setToken(secrets.token);

UserApp.User.search({
    "page": 1,
    "page_size": 250,
    "fields": "*"
}, function(error, result){

    var usersToNotify = result.items.filter(function(user) {
        console.log(user.properties.reminder_frequency.value);
        if (priority <= parseInt(user.properties.reminder_frequency.value)) {
            return user;
        }
    });

    var notifyFuncs = usersToNotify.map(function(user) {
        console.log(user);
        var props = user.properties;
        var device_type = props.device_type.value;
        var device_id = props.device_id.value;
        if ((device_type == 'android' || device_type == 'ios') && device_id) {
            return function(callback) {
                console.log("sending to " + device_id);
                api[device_type].sendpush("Time for your check-in", device_id, function() {
                    callback();
                });
            }
        } else {
            return function(callback) {
                callback();
            }
        }
    });

    console.log(notifyFuncs);
    async.series(notifyFuncs);
});

