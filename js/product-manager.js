const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.email !== "admin@gmail.com") {
    window.location.href = "/pages/login.html";
}
 
const logout = () => {
    localStorage.removeItem("currentUser");
}

const changePage = () => {
    window.location.href = "/pages/quiz-builder.html";
}