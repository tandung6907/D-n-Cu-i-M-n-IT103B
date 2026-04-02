function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userLogin");
    window.location.href = "../index/logIn.html";
}