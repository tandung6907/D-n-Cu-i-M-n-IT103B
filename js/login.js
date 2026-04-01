const formLogin = document.getElementById("formLogin");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");

const showError = (selector, message, visible) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = message;
    el.style.display = visible ? "block" : "none";
};

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    showError(".error-email", "", false);
    showError(".error-password", "", false);

    const emailValue = userEmail.value.trim().toLowerCase();
    const passwordValue = userPassword.value.trim();

    if (!emailValue) {
        showError(".error-email", "Vui lòng nhập địa chỉ email", true);
        return;
    }

    if (!passwordValue) {
        showError(".error-password", "Vui lòng nhập mật khẩu", true);
        return;
    }

    if (emailValue === "admin@gmail.com" && passwordValue === "admin123") {
        const adminUser = {
            id: 0,
            name: "Quản trị viên",
            email: "admin@gmail.com",
            role: "admin"
        }

        localStorage.setItem("currentUser", JSON.stringify(adminUser));

        Swal.fire({
            title: 'ĐĂNG NHẬP THÀNH CÔNG!',
            text: 'Chào mừng quản trị viên!',
            icon: 'success',
            background: 'white',
            color: '#00d4ff',
            timer: 1500,
            timerProgressBar: true,
            didClose: () => {
                window.location.href = "/pages/category-manager.html";
            }
        });
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(u => u.email === emailValue && u.password === passwordValue);

    if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify(userFound));
        Swal.fire({
            title: 'ĐĂNG NHẬP THÀNH CÔNG!',
            text: 'Chào mừng bạn quay trở lại hệ thống!',
            icon: 'success',
            background: 'white',
            color: '#00d4ff',
            timer: 2000,
            timerProgressBar: true,
            didClose: () => {
                window.location.href = "/pages/dashboard.html";
            }
        });

    } else {
        showError(".error-email", "Email hoặc mật khẩu không chính xác", true);
    }
});

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    window.location.href = currentUser.email === "admin@gmail.com"
        ? "/pages/category-manager.html"
        : "/pages/dashboard.html";
}