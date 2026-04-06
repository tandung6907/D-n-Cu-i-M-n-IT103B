
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    window.location.href = currentUser.role === "admin"
        ? "/pages/category-manager.html"
        : "/pages/dashboard.html";
}


let users = JSON.parse(localStorage.getItem("users")) || [];


const formRegi = document.getElementById("formRegi");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userRePassword = document.getElementById("userRePassword");


function showError(selector, message, visible) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = message;
    el.style.display = visible ? "block" : "none";
}

function createId() {
    return users.length === 0 ? 1 : Math.max(...users.map(u => u.id)) + 1;
}


function validateForm(nameValue, emailValue, passwordValue, rePassValue) {
    let isValid = true;

    
    if (!nameValue) {
        showError(".error-name", "Họ và tên không được để trống", true);
        isValid = false;
    } else {
        showError(".error-name", "", false);
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailExist = users.some(u => u.email === emailValue);

    if (!emailValue) {
        showError(".error-email", "Email không được để trống", true);
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError(".error-email", "Email phải đúng định dạng", true);
        isValid = false;
    } else if (emailExist) {
        showError(".error-email", "Email đã tồn tại trên hệ thống", true);
        isValid = false;
    } else {
        showError(".error-email", "", false);
    }

    
    if (!passwordValue) {
        showError(".error-password", "Mật khẩu không được để trống", true);
        isValid = false;
    } else if (passwordValue.length < 8) {
        showError(".error-password", "Mật khẩu phải có tối thiểu 8 ký tự", true);
        isValid = false;
    } else {
        showError(".error-password", "", false);
    }

    
    if (!rePassValue) {
        showError(".error-repassword", "Mật khẩu xác nhận không được để trống", true);
        isValid = false;
    } else if (rePassValue !== passwordValue) {
        showError(".error-repassword", "Mật khẩu xác nhận phải trùng với mật khẩu", true);
        isValid = false;
    } else {
        showError(".error-repassword", "", false);
    }

    return isValid;
}


function handleRegister(e) {
    e.preventDefault();

    const nameValue = userName.value.trim();
    const emailValue = userEmail.value.trim().toLowerCase();
    const passwordValue = userPassword.value.trim();
    const rePassValue = userRePassword.value.trim();

    if (!validateForm(nameValue, emailValue, passwordValue, rePassValue)) return;

    
    users.push({
        id: createId(),
        fullName: nameValue,
        email: emailValue,
        password: passwordValue,
        role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));
    formRegi.reset();

    Swal.fire({
        title: 'ĐĂNG KÝ THÀNH CÔNG!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        didClose: () => window.location.href = "/pages/login.html"
    });
}


formRegi.addEventListener("submit", handleRegister);