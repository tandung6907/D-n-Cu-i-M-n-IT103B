let account = JSON.parse(localStorage.getItem("quizzAcc"));
(function() {
    const status = localStorage.getItem("isLoggedIn");
    const userLogin = JSON.parse(localStorage.getItem("userLogin")); 
    const currentPage = window.location.pathname.split("/").pop();
    if (status !== "true" || !userLogin) {
        redirectWithError('Cần phải đăng nhập trước khi truy cập trang này', "../index/logIn.html");
        return;
    }
    const allowedForUser = ["doTest.html", "mainPages.html", "signIn.html", "logIn.html", ""]; 
    if (userLogin.role === "user") {
        if (!allowedForUser.includes(currentPage)) {
            redirectWithError('Bạn không có quyền truy cập vào khu vực quản trị!', "./mainPages.html");
        }
    }
    function redirectWithError(message, targetUrl) {
        window.addEventListener('DOMContentLoaded', () => {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Thông báo',
                    text: message,
                    icon: 'error',
                    confirmButtonText: 'Đồng ý',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = targetUrl;
                    }
                });
            } else {
                alert(message);
                window.location.href = targetUrl;
            }
        });
    }
})();