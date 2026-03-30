let account = JSON.parse(localStorage.getItem("quizzAcc"));
function errorAnnouncement(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}