function setTeamInfo (team) {
  // TODO: set url
  var url = 'http://example.com/hoge'

  $.ajax({
    type: 'GET',
    url: "https://slack.com/api/users.list",
    data: { token: team.access_token }
  }).done(function( data ) {
    if(data.ok) {
        team.users = data.members
        var teams = store.get('shinobi.teams') || []
        teams.push(team)
        teams = _.uniq(teams, 'team_id');
        store.set('shinobi.teams', teams )
    }
  })
}
