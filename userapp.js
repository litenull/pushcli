var UserApp = require('userapp');
var secrets = require('./userapp_config').secrets;
var api = require('./lib').api;
var util = require('util');
var Q = require("q");
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
        console.log(user.properties.frequency.value);
        if (priority <= parseInt(user.properties.frequency.value)) {
            return user;
        }
    });

    var notifyFuncs = usersToNotify.map(function(user) {
        console.log(user);
        var props = user.properties;
        var device_type = props.device_type.value;
        var device_id = props.device_id.value;
        return function() {
            api[device_type].sendpush("Time for your check-in", device_id);
        }
    });

    //calls each notify call sequentially
    //see: https://github.com/kriskowal/q#sequences
    notifyFuncs.reduce(Q.when, Q(''));

});

