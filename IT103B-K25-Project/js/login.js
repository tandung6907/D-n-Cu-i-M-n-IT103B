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

    const emailValue = userEmail.value.trim();
    const passwordValue = userPassword.value.trim();

    if (!emailValue) {
        showError(".error-email", "Vui lòng nhập địa chỉ email", true);
        return;
    }
    showError(".error-email", "", false);

    if (!passwordValue) {
        showError(".error-password", "Vui lòng nhập mật khẩu", true);
        return;
    }
    showError(".error-password", "", false);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(u => u.email === emailValue && u.password === passwordValue);

    if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify(userFound));
        Swal.fire({
            title: 'ĐĂNG NHậP THÀNH CÔNG!',
            text: 'Chào mừng bạn quay trở lại hệ thống!',
            icon: 'success',

            background: 'white',
            color: '#00d4ff',

            timer: 2000,
            timerProgressBar: true,

            didClose: () => {
                window.location.href = userFound.email === "admin@gmail.com"
                    ? "/pages/category-manager.html"
                    : "/pages/dashboard.html";
            }
        });

    } else {
        showError(".error-email", "Email hoặc mật khẩu không chính xác", true);
        showError(".error-password", "Email hoặc mật khẩu không chính xác", true);
    }
});
