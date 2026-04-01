const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "/pages/login.html";
}
const logout = () => {
    localStorage.removeItem("currentUser");
}