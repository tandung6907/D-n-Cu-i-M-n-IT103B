function errorAnnouncement(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}
const defaultData = [
    {
        name: "admin",
        email: "admin@gmail.com",
        oripsw: "admin1234",
        repsw: "admin1234", 
        role: "admin",
    }
];

let account = JSON.parse(localStorage.getItem("quizzAcc"));
let information = [];

if (!account) {
    information = defaultData;
    localStorage.setItem("quizzAcc", JSON.stringify(information));
} else {
    information = account;
}
function siClick(event){
    event.preventDefault(); 
    let fName = document.getElementById("siName").value.trim();
    let mails = document.getElementById("siEmail").value.trim();
    let psw = document.getElementById("siPass").value.trim();
    let cfm = document.getElementById("siConfirm").value.trim();
    if(fName.length == 0){
        errorAnnouncement("#error-announcement-fName","Tên không được để trống","block");
        return;
    }
    if(fName.length<2){
        errorAnnouncement("#error-announcement-fName","Tên cần chứa ít nhất 2 ký tự","block");
        return;
    }
    errorAnnouncement("#error-announcement-fName","","none");
    if(mails.length == 0){
        errorAnnouncement("#error-announcement-mails","Email không được để trống","block");
        return;
    }
    for(let i =0;i<information.length;i++){
        if(information[i].email == mails){
            errorAnnouncement("#error-announcement-mails","Email đã tồn tại","block");
            return;
        }
    }
    if(!validateEmail(mails)){
        errorAnnouncement("#error-announcement-mails","Email đang không ở đúng định dạng","block");
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
    if(cfm.length==0){
        errorAnnouncement("#error-announcement-cfm","Password không được để trống","block");
        return;
    }
    if(cfm.length<8){
        errorAnnouncement("#error-announcement-cfm","Password cần chứa ít nhất 8 ký tự","block");
        return;
    }
    if(cfm!=psw){
        errorAnnouncement("#error-announcement-cfm","Password không trùng khớp","block");
        return;
    }
    errorAnnouncement("#error-announcement-cfm","","none");
    let infObj = {
        name: fName,
        email: mails,
        oripsw: psw,
        repsw: cfm, 
        role: "user",
    }
    information.push(infObj);
    localStorage.setItem("quizzAcc",JSON.stringify(information));
    Swal.fire({
            text: 'Đang chuyển hướng tới trang đăng nhập',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true
        }).then(() => {
            window.location.href = "../index/logIn.html";
        });
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}