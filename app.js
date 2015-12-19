var express = require('express');
var app = express();
var request = require('request');
var _ = require('lodash');
var Qs = require('qs');
var functions = require('./functions')
var events = require('events');
var eventEmitter = new events.EventEmitter();

//Create a static file server
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});
app.set('view engine', 'ejs')

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

app.get('/', function (req, res) {
    res.render('index', { direct: true } )
})

app.listen(process.env.PORT || 8080);
functions.log('Express server started');
