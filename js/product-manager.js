
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/pages/login.html";
}

function logout() {
    localStorage.removeItem("currentUser");
}

function changePage() {
    localStorage.removeItem("currentEditingTestId");
    window.location.href = "/pages/quiz-builder.html";
}
 

