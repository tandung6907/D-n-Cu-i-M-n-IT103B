function errorAnnouncement(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}
let account = JSON.parse(localStorage.getItem("quizzAcc"));
let information = account ? account : [];
function siClick(event){
    event.preventDefault(); 
    let fName = document.getElementById("siName").value.trim();
    let mails = document.getElementById("siEmail").value.trim();
    let psw = document.getElementById("siPass").value.trim();
    let cfm = document.getElementById("siConfirm").value.trim();
    if(fName.length == 0){
        errorAnnouncement("#error-announcement-fName","Name should not be empty!","block");
        return;
    }
    errorAnnouncement("#error-announcement-fName","","none");
    if(mails.length == 0){
        errorAnnouncement("#error-announcement-mails","Email should not be empty","block");
        return;
    }
    for(let i =0;i<information.length;i++){
        if(information[i].email == mails){
            errorAnnouncement("#error-announcement-mails","Email is already existed","block");
            return;
        }
    }
    if(!validateEmail(mails)){
        errorAnnouncement("#error-announcement-mails","Email is not in the correct form","block");
        return;
    }
    errorAnnouncement("#error-announcement-mails","","none");
    if(psw.length==0){
        errorAnnouncement("#error-announcement-psw","Password should not be empty","block");
        return;
    }
    if(psw.length<8){
        errorAnnouncement("#error-announcement-psw","Password should contain at least 8 characters","block");
        return;
    }
    errorAnnouncement("#error-announcement-psw","","none");
    if(cfm.length==0){
        errorAnnouncement("#error-announcement-cfm","Password should not be empty","block");
        return;
    }
    if(cfm.length<8){
        errorAnnouncement("#error-announcement-cfm","Password should contain at least 8 characters","block");
        return;
    }
    if(cfm!=psw){
        errorAnnouncement("#error-announcement-cfm","Password is not matched with the one provided","block");
        return;
    }
    errorAnnouncement("#error-announcement-cfm","","none");
    let infObj = {
        name: fName,
        email: mails,
        oripsw: psw,
        repsw: cfm, 
    }
    information.push(infObj);
    localStorage.setItem("quizzAcc",JSON.stringify(information));
    document.location.href = "../index/logIn.html";
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}