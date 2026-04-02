let account = JSON.parse(localStorage.getItem("quizzAcc"));
function errorAnnouncement(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
function liClick(event){
  event.preventDefault();
  let mails = document.getElementById("siEmail").value.trim();
  let psw = document.getElementById("siPass").value.trim();
  if(mails.length==0){
    errorAnnouncement("#error-announcement-mails","Email không được để trống","block");
      return;
  }
  if(!validateEmail(mails)){
    errorAnnouncement("#error-announcement-mails","Email không đúng địng dạng","block");
      return;
  }
  errorAnnouncement("#error-announcement-mails","","none");
  if(psw.length==0){
    errorAnnouncement("#error-announcement-psw","Password không được để trống","block");
      return;
  }
  if(psw.length<8){
    errorAnnouncement("#error-announcement-psw","Password cần chứa ít nhất 8 ký tự","block");
      return;
  }
  errorAnnouncement("#error-announcement-psw","","none");
  let userFound = account.find((value)=>{
        return value.email==mails && value.oripsw==psw;
    });
    if(!userFound){
        errorAnnouncement("#error-announcement-psw","Password hoặc email sai","block");
        return;
    }else{
        errorAnnouncement("#error-announcement-psw","","none");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userLogin", JSON.stringify(userFound));
        alert("Log in successfully");
    }
    
    if(userFound.role === "admin") {
        window.location.href = "../index/categoryManager.html";
    } else {
        window.location.href = "../index/mainPages.html";
    }
}