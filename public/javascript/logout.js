function log_out () {
  store.remove('user_id');
  document.getElementById("register_form").style.display="blocks";
  document.getElementById("header").style.display="none";
}
