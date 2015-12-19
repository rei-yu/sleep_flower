var colors = require('colors');
require('date-utils');

colors.setTheme({
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

function formatted_date_now() {
  var dt = new Date()
  return dt.toFormat("YYYY-MM-DD_HH24-MI-SS")
}

function generate_session_id() {
  function random_id() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1)
  }
  return random_id() + random_id() + '-' + random_id() + '-' + random_id() + '-' +
         random_id() + '-' + random_id() + random_id() + random_id()
}

function log(message) {
  console.log(formatted_date_now() + ' ' + message)
}

module.exports = {
  formatted_date_now: formatted_date_now,
  generate_session_id: generate_session_id,
  log: log,
}
