var express = require('express');
var app = express();
var request = require('request');
var _ = require('lodash');
var Qs = require('qs');
var functions = require('./functions')
var events = require('events');
var eventEmitter = new events.EventEmitter();

// var apns    = require('apn');
// var apn_options = {
//   cert    : './iOS/apns-dev-cert.pem',
//   key     : './iOS/apns-dev-key-noenc.pem',
//   gateway : 'gateway.sandbox.push.apple.com',
//   port    : 2195,
//   passphrase:
//   production: false,
// };

//Create a static file server
app.use(function() {
  app.use(express.static(__dirname + '/public'));
});
app.set('view engine', 'ejs')

// var push = function (__DEVICE_TOKEN__, alert_message, data) {
//     var myDevice = apns.Device(__DEVICE_TOKEN__)
//     var apnsConnection = new apns.Connection(apn_options)
//     var note           = new apns.Notification()
//     note.expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
//     note.alert = alert_message
//     note.sound = ''
//     note.contentAvailable = 1
//     note.payload = data

//     apnsConnection.pushNotification(note, myDevice)
// }

// var token = '370fd63d21e06cbc944265c4e399ee1dcc2506ce5e22766fa0768d9ca0d4f44c';
// push(token, "", {'messageFrom': 'Caroline'})

var get_access_info = function (app_code, res) {
    var requset_query_string = 'code=' + app_code
                             + '&client_id=' + SLACK_CLIENT_KEY
                             + '&client_secret=' + SLACK_CLIENT_SECRET
    var url = 'https://slack.com/api/oauth.access?' + requset_query_string

    request(url, function (error, response, body) {
        var message = ''

        if (!error && response.statusCode == 200) {
            var response_obj = JSON.parse(body)
            if( response_obj.ok ) {
                functions.log(body)
                message = 'Authentification succeed! URL: '
                var host = res.header.host

                var url_to_be_set = 'http://' + res.req.headers.host + '/chat.postMessage?'
                                  + '&token=' + response_obj.access_token
                                  + '&channel=' + '__channel__' // TODO: to be replaced
                                  + '&text=%s'
                message += url_to_be_set

                var options = {
                    uri: 'https://slack.com/api/channels.list',
                    form: {
                        token: response_obj.access_token,
                    }
                }

                request.post(options, function(error, response, body){
                    if (!error && response.statusCode == 200) {
                        var res_obj = JSON.parse(body)

                        if( res_obj.ok ) {
                            var channels = _.map(res_obj.channels, function (channel) {
                                return channel.name
                            })

                            var authed_team_info = {
                                team_id: response_obj.team_id,
                                team_name: response_obj.team_name,
                                channels: channels,
                                access_token: response_obj.access_token,
                            }

                            res.render('/friends/index', {
                                direct: false,
                                team: JSON.stringify(authed_team_info),
                            })
                        } else {
                            res.redirect('/')
                        }
                    } else {
                        res.send(error)
                    }
                })
            } else {
                functions.log(response_obj.error)
                res.redirect('/')
            }
        } else {
            res.send(error)
        }
    })
}

var auth = function (req, res) {
    functions.log('req', req)
    functions.log('res', res)

    var query_string = require('url').parse(req.url).query

    var app_auth_code = queries.code

    if(app_auth_code) {
        get_access_info(app_auth_code, res)
    }
}

var post_message = function (req, res) {
    var query_string = require('url').parse(req.url).query

    var options = {
        uri: 'https://slack.com/api/chat.postMessage',
        form: {
                token: queries.token,
              channel: queries.channel,
             username: queries.username,
                 text: queries.text,
              as_user: true,
        }
    }

    request.post(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            functions.log(body);
            res.render('chat_postMessage')
        } else {
            functions.log('error: ' + response.statusCode);
            res.send(error)
        }
    })
}


// var settings = function (req, res) {
//     var permissions_to_daichi = [
//         { data_type: 'GeoLocation',
//           open_status: 'depends', },
//         { data_type: 'Network Strength',
//           open_status: 'public', },
//         { data_type: 'Steps',
//           open_status: 'public', },
//         { data_type: 'Ambient light sensor',
//           open_status: 'public', },
//         { data_type: 'Battery',
//           open_status: 'public', },
//         { data_type: 'Three-axis gyro',
//           open_status: 'public', },
//         { data_type: 'Barometer',
//           open_status: 'public', },
//         { data_type: 'Music',
//           open_status: 'depends', },
//         { data_type: 'Camera',
//           open_status: 'private', },
//         { data_type: 'Microphone',
//           open_status: 'private', },
//         { data_type: 'Proximity sensor',
//           open_status: 'public', },
//         { data_type: 'Shake',
//           open_status: 'private', },
//         { data_type: 'Digital compass',
//           open_status: 'private', },
//         { data_type: 'Magnetic Field',
//           open_status: 'private', },
//         { data_type: 'Earphone',
//           open_status: 'private', },
//         { data_type: 'Heart Rate',
//           open_status: 'private', },
//         { data_type: 'Body Temperature',
//           open_status: 'private', },
//     ]
//     res.render('settings', { permissions: JSON.stringify(permissions_to_daichi)})
// }


function receive_sensor_data (req, res) {
    functions.log('3. receive_sensor_data')
    var query_string = require('url').parse(req.url).query
    var queries = Qs.parse(query_string)
    eventEmitter.emit('respond_sensor_data', queries)
    res.send(JSON.stringify({ok: true}))
}

var receive_request_to_sensor = function (req, res) {
    functions.log('1. receive_request_to_sensor')
    var query_string = require('url').parse(req.url).query
    var queries = Qs.parse(query_string)
    functions.log('2. push')
    push(token, '', { data_type: 'location'})
    eventEmitter.once('respond_sensor_data', function (queries) {
        functions.log(queries.sensor_data)
        functions.log('4. respond_sensor_data to requester')
        res.send(JSON.stringify({ok: true, data_type: 'location', data: queries}))
    });
}

app.get('/', function (req, res) {
    res.render('index', { direct: true } )
})

var port = 8080;
app.listen(port);
functions.log('Express server started on port %s', port);
