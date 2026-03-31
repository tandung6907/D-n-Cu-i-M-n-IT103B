const REGISTER_KEY = "registers";

let registers = [];
let nextId = 1;

// khai báo biến
let registerName, registerEmail, registerPass, checkPass, form;
let errorName, errorEmail, errorPass;

//save - load - load không mất dữ liệu
function saveToLocalStorage() {
  localStorage.setItem(REGISTER_KEY, JSON.stringify(registers));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem(REGISTER_KEY);
  return data ? JSON.parse(data) : [];
}

window.onload = function () {
  const data = loadFromLocalStorage();

  if (data.length > 0) {
    registers = data;
    nextId = registers.length ? Math.max(...registers.map((p) => p.id)) + 1 : 1;
  }

  registerName = document.getElementById("name-register");
  registerEmail = document.getElementById("email-register");
  registerPass = document.getElementById("pass-register");
  checkPass = document.getElementById("check-pass");
  errorEmail = document.querySelector(".error-email");
  errorName = document.querySelector(".error-name");
  errorPass = document.querySelector(".error-pass");
  form = document.querySelector(".form-register");

  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  });
};

function handleSubmit() {
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const pass = registerPass.value.trim();
  const checked = checkPass.value.trim();

  if (!validateName(name) || !email || !pass || !checked) return;

  const newRegister = {
    id: nextId++,
    name: name,
    email: email,
    pass: pass,
  };

  registers.push(newRegister);
  saveToLocalStorage();

  // RESET
  registerEmail.value = "";
  registerName.value = "";
  registerPass.value = "";
  checkPass.value = "";
  registerName.focus();
}

function validateName(name) {
  errorName.style.display = "none";

  if (name.length === 0) {
    errorName.style.display = "block";
    errorName.textContent = "Tên đăng nhập không để trống!";
    return false;
  }

  const regexName = /^([A-ZÀ-Ỹ][a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)*$/u;
  if (name.length < 5 || !regexName.test(name)) {
    errorName.style.display = "block";
    errorName.textContent =
      "Tên không được chứa ký tự đặc biệt không có số và dài hơn 5 ký tự!";
    return false;
  }

  errorName.style.display = "none";
  return true;
}

function validateEmail(email) {}
