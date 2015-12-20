function log_in () {
  document.getElementById("header").style.display="block";
  document.getElementById("register_form").style.display="none";
  login_info = document.getElementById("login_info");
  login_info.textContent = "Your id: " + store.get("user_id");
  login_info.style.display="block";

}
