var set_up_team = function (team) {
  var $team_dom = $('<li>', { 
    id: 'team_' + team.team_id,
    html: team.team_name + ':  ',
    "class": 'team',
  })
  $('#teams').append($team_dom);

  var $channels_dom = $('<select>', { 
    id: 'channels_' + team.team_id,
    name: 'channels',
    "class": 'channels',
  }).show()

  $channels_dom.append('<option value="">select channel</option>')

  $('#team_' + team.team_id).append($channels_dom)

  var channels = team.channels || []
  channels.forEach(function (channel) {
    var $channel_dom = $('<option>', {
      value: channel,
      text: channel,
    })
    $channels_dom.append($channel_dom)
  })

  $team_dom.append('<br>')
  $team_dom.append($('<span>', { 
    id: 'url_for_' + team.team_id,
  }))
  $channels_dom.change(function() {
    var channel = $channels_dom.val()

    var url = 'http://' + location.host 
                        + '/chat.postMessage?token=' + team.access_token
                        + '&channel=%23' + channel
                        + '&text=%s'
    console.log(url)
    $('#url_for_' + team.team_id).text(url)
    $('#url_for_' + team.team_id).addClass('url')
  })

  connect_websocket(team.access_token)
}

var display_teams_header = function () {
  $('#teams_header').show()
}