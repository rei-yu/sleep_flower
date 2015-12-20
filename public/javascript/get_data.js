// var public_spreadsheet_url = '1ppY0X-YGRcAtRLn-9m8cM4Et_Hy2kRvMua5teoTcliM/ojc2tyx';
var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1ppY0X-YGRcAtRLn-9m8cM4Et_Hy2kRvMua5teoTcliM&output=html';

function init() {
  var tabletop = Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  alert("Successfully processed!")
  console.log(data);
}
