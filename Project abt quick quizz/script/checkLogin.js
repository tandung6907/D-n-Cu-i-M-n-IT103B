(function() {
    let status = localStorage.getItem("isLoggedIn");
    if (status !== "true") {
        alert("Vui lòng đăng nhập để truy cập trang này!");
        window.location.href = "../index/logIn.html"; 
    }
})();