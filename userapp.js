var UserApp = require('userapp');
var secrets = require('./userapp_config').secrets;
var api = require('./lib').api;
var util = require('util');
var async = require('async');
var optimist = require('optimist')

var schedule = require('node-schedule');

var argv = optimist  
    .usage('Usage: $0 --priority [int] --background')
    .describe('priority', 'Set the priority you want to run')
    .describe('background', 'Run the push server in background')
    .argv;

var background = argv.background;
var priority = argv.priority;

UserApp.initialize({app_id:secrets.app_id});
UserApp.setAppId(secrets.app_id);
UserApp.setToken(secrets.token);

if (argv.help) {
    optimist.showHelp();
    process.exit(1);
}

if (!argv.priority && !argv.background) {
    optimist.showHelp();
    process.exit(1);
}

var sendNotifications = function(cb) { 
    UserApp.User.search({
        "page": 1,
        "page_size": 250,
        "fields": "*"
    }, function(error, result){

        var usersToNotify = result.items.filter(function(user) {
            if (priority <= parseInt(user.properties.reminder_frequency.value)) {
                return user;
            }
        });

        var notifyFuncs = usersToNotify.map(function(user) {
            var props = user.properties;
            var device_type = props.device_type.value;
            var device_id = props.device_id.value;
            if ((device_type == 'android' || device_type == 'ios') && device_id) {
                return function(callback) {
                    console.log('Sending notification to ' + user.login + ' token: ' + props.device_id.value)
                    api[device_type].sendpush("Time for your check-in", device_id, function() {
                        callback();
                    });
                }
            } else {
                return function(callback) {
                    callback();
                    cb();
                }
            }
        });

        console.log('Sending notifications...');
        async.series(notifyFuncs);
    });
}

if (background) {
        var priority = 1;
        var j = schedule.scheduleJob('0 18,19,20 * * *', function(){
            sendNotifications(function() {
                console.log('Sending notifications with priority ' + priority);
                priority++;

                if (priority > 3) {
                    priority = 1;
                }
            });
        });

}else{
    sendNotifications();
}

console.log('EXLI API running!')

SOME_EXIT_CONDITION = false;
(function wait () {
   if (!SOME_EXIT_CONDITION) setTimeout(wait, 1000);
})();

