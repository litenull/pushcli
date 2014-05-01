var lib = require('./lib');
var util = require('util');
var argv = require('optimist')
    .usage('Usage: $0 --platform [ios|android] --text [string] --token [token]')
    .demand(['platform', 'text', 'token'])
    .argv;

var api = lib.api;

switch (argv.platform) {
  case 'ios':
    api.ios.sendpush(argv.text, argv.token)
  break;
  case 'android':
    api.android.sendpush(argv.text, argv.token);
  break;
}