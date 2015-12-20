function get_flower (score) {
  var pic_url;

  if (store.get('has_leaf')) {
    // pic with leaf
    if (score > 80) {
      store.set('lose_leaf_count', 0);
      pic_url = "/img/flower-happy-with-leaf.png"
    } else if (score >40) {
      store.set('lose_leaf_count', 0);
      pic_url = "/img/flower-nogood-with-leaf.png"
    } else {
      if (store.get('lose_leaf_count')==1) {
        store.set('has_leaf', false);
        window.confirm('葉っぱが枯れちゃったよ')
        pic_url = "/img/flower-bad.png"
      } else {
        store.set('lose_leaf_count', 1);
        window.confirm('明日も眠いと、葉っぱが枯れてしまうよ')
        pic_url = "/img/flower-bad-with-leaf.png"
      }
    }
  } else {
    //pic without leaf
    if (score > 80) {
      if (store.get('get_leaf_count')==2) {
        store.set('has_leaf', true);
        window.confirm('葉っぱがさいたよ！おめでとう！！')
        pic_url = "/img/flower-happy-with-leaf.png"
      } else if (store.get('get_leaf_count')==1){
        store.set('get_leaf_count', 2);
        window.confirm('もう少しで葉っぱが生えてきそう…！')
        pic_url = "/img/flower-happy.png"
      } else {
        store.set('get_leaf_count', 1);
        pic_url = "/img/flower-happy.png"
      }
    } else if (score >40) {
      store.set('get_leaf_count', 0);
      pic_url = "/img/flower-nogood.png"
    } else {
      store.set('get_leaf_count', 0);
      pic_url = "/img/flower-bad.png"
    }
  }

  login_info = document.getElementById("flower");
  login_info.innerHTML = "<img src=\"" + pic_url + "\" width=300px>";
}
