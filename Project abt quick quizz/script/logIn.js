let account = JSON.parse(localStorage.getItem("quizzAcc"));
function errorAnnouncement(lass, announcement, value) {
  document.querySelector(lass).style.display = value;
  document.querySelector(lass).textContent = announcement;
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
function liClick(event) {
  event.preventDefault();
  let mails = document.getElementById("siEmail").value.trim();
  let psw = document.getElementById("siPass").value.trim();
  if (mails.length == 0) {
    errorAnnouncement("#error-announcement-psw", "Password hoặc email sai", "block");

    return;
  }
  if (!validateEmail(mails)) {
    errorAnnouncement("#error-announcement-psw", "Password hoặc email sai", "block");

    return;
  }
  errorAnnouncement("#error-announcement-mails", "", "none");
  if (psw.length == 0) {
    errorAnnouncement("#error-announcement-psw", "Vui lòng nhập mật khẩu", "block");

    return;
  }
  if (psw.length < 8) {
    errorAnnouncement("#error-announcement-psw", "Password hoặc email sai", "block");

    return;
  }
  errorAnnouncement("#error-announcement-psw", "", "none");
  let userFound = account.find((value) => {
    return value.email == mails && value.oripsw == psw;
  });
  if (!userFound) {
    errorAnnouncement("#error-announcement-psw", "Password hoặc email sai", "block");
    return;
  } else {
    errorAnnouncement("#error-announcement-psw", "", "none");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userLogin", JSON.stringify(userFound));
  }

  if (userFound.role === "admin") {
    Swal.fire({
      text: 'Đang chuyển hướng tới trang chỉnh sửa danh mục',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {
      window.location.href = "../index/categoryManager.html";
    });
  } else {
    Swal.fire({
      text: 'Đang chuyển hướng tới trang chủ',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {
      window.location.href = "../index/mainPages.html";
    });
  }
}