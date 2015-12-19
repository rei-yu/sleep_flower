var display_window_title = function (message) {
  var i = 0
  document.title = message.substr(i,26)

  var min_length_to_scroll = 22
  if (message.length > min_length_to_scroll){
    setTimeout(function() {
      var interval_id = setInterval(function() {
        i += 1
        document.title = message.substr(i, min_length_to_scroll)

        if(i > message.length - min_length_to_scroll) {
          clearInterval(interval_id)
        }
      }, 100);
    }, 2000);
  }
}


var connect_websocket = function (access_token) {
  $.ajax({
    type: 'GET',
    url: "https://slack.com/api/rtm.start",
    data: { token: access_token }
  }).done(function( msg ) {
    connect_to_websocket_server(msg.url, access_token)
  })
}

var connect_to_websocket_server = function (wss_url, access_token) {
  var ws_client = new WebSocket(wss_url)
  ws_client.onopen = function() { console.log(ws_client) }

  ws_client.onmessage = function (evt) {
    console.log(evt)
    var data = JSON.parse(evt.data)
    if(data.type === 'message') {
      var sender_name
      var teams = store.get('shinobi.teams') || []
      if(data.team) {
        var team = _.find(teams, {'team_id': data.team})

        sender_name = _.result(_.find(team.users, {'id': data.user}), 'name')

      } else {
        var user
        teams.forEach(function(team){
          user = _.find(team.users, {id: data.user})
          if(typeof user !== 'undefined') { 
            sender_name = user.name
            return
          }
        })
      }
      var message = '[' + sender_name + ']' + data.text
      display_window_title(message)
    }
  }

  ws_client.onclose = function() { 
    console.log("Connection is closed...")
    connect_websocket()
  }
}