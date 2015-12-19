init()
function init() {
  if (!store.enabled) {
    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
    return
  }

  function appendChannelInfo() {
    store.forEach(function(key, val) {
      channelUrl = document.createElement('div')
      channelUrl.setAttribute('class', 'info_contents')
      channelUrl.innerHTML =  'Team: ' + val.team + ' Channel: ' + val.channel + '</br>URL: ' + val.url + '</br></br>'
      channelSettingsArea.appendChild(channelUrl)
    })
  }

  var channelSettingsArea = document.getElementById('channel_settings');

  appendChannelInfo();
}
