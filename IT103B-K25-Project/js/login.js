const formLogin = document.getElementById("formLogin");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");

const errorEmail = document.querySelector(".error-email");
const errorPassword = document.querySelector(".error-password");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValue = userEmail.value.trim();
    const passwordValue = userPassword.value.trim();

    if (emailValue.length === 0) {
        errorEmail.textContent = "Vui lòng nhập địa chỉ email";
        errorEmail.style.display = "block";
        userEmail.classList.add("input-error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        errorEmail.textContent = "Email không đúng định dạng";
        errorEmail.style.display = "block";
        userEmail.classList.add("input-error");
        return;
    }

    errorEmail.style.display = "none";
    userEmail.classList.remove("input-error");

    if (passwordValue.length === 0) {
        errorPassword.textContent = "Vui lòng nhập mật khẩu";
        errorPassword.style.display = "block";
        userPassword.classList.add("input-error");
        return;
    }

    errorPassword.style.display = "none";
    userPassword.classList.remove("input-error");

    window.location.href = "/pages/dashboard.html";
});