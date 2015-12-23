// var public_spreadsheet_url = '1ppY0X-YGRcAtRLn-9m8cM4Et_Hy2kRvMua5teoTcliM/ojc2tyx';
var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1ppY0X-YGRcAtRLn-9m8cM4Et_Hy2kRvMua5teoTcliM&output=html';

function init() {
  var tabletop = Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  parseData(data);
}

function parseData(data) {
  var id = store.get("user_id");
  var score = 100;
  var get_leaf_count = 0;
  var lose_leaf_count = 0;
  var has_leaf = false;

  for (i=0; i<data.length; i++) {
    if (data[i]["User ID"] == id) {
      console.log("id", data[i]["User ID"]);
      console.log("yellow", data[i]["｢少し眠そう｣の回数(黄色)"]);
      console.log("orange", data[i]["｢とても眠そう｣の回数(オレンジ色)"]);

      var yellow = data[i]["｢少し眠そう｣の回数(黄色)"];
      var orange = data[i]["｢とても眠そう｣の回数(オレンジ色)"];

      score -= (yellow * 10 + orange * 20);
      if (score >= 80) {
        get_leaf_count += 1;
        lose_leaf_count = 0;
      } else if (score < 40) {
        get_leaf_count = 0;
        lose_leaf_count += 1;
      } else {
        get_leaf_count = 0;
        lose_leaf_count = 0;
      }
    }
  }

  if (get_leaf_count >2 ) {
    has_leaf = true;
  }

  get_flower(score, has_leaf);
}

function get_flower(score, has_leaf) {
  var pic_url;

  if (has_leaf) {
  // pic with leaf
    if (score >= 80) {
      pic_url = "/img/flower-happy-with-leaf.png"
    } else if (score >= 40) {
      pic_url = "/img/flower-nogood-with-leaf.png"
    } else {
        window.confirm('葉っぱが枯れてしまいそう')
        pic_url = "/img/flower-bad-with-leaf.png"
    }
  } else {
    //pic without leaf
    if (score >= 80) {
      pic_url = "/img/flower-happy.png"
    } else if (score >= 40) {
      pic_url = "/img/flower-nogood.png"
    } else {
      pic_url = "/img/flower-bad.png"
    }
  }

  login_info = document.getElementById("flower");
  login_info.innerHTML = "<img src=\"" + pic_url + "\" width=300px>";
}
