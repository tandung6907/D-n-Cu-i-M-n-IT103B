// Kiểm tra đăng nhập admin
const checkLogin = () => {
  let currentUserStr = localStorage.getItem("currentUser");
  if (!currentUserStr) {
    window.location.href = "../pages/login.html";
    return;
  }
  let currentUser;
  try {
    currentUser = JSON.parse(currentUserStr);
  } catch (e) {
    localStorage.removeItem("currentUser");
    window.location.href = "../pages/login.html";
    return;
  }
  
  if (currentUser.role !== "admin") {
    window.location.href = "../pages/home.html";
    return;
  }
}

// Chạy kiểm tra khi trang load
window.onload = function() {
  checkLogin();

  // Lấy ID test từ URL (?id=1)
  let urlParams = new URLSearchParams(window.location.search);
  let testId = urlParams.get('id') || 1;
  let tests = JSON.parse(localStorage.getItem("tests")) || [];
  let test = null;
  for (let i = 0; i < tests.length; i++) {
    if (tests[i].id == testId) {
      test = tests[i];
      break;
    }
  }
  if (!test) test = tests[0] || {};

  // Điền form
  let nameInput = document.querySelector('.test-info-section input[type="text"]');
  if (nameInput) nameInput.value = test.name || '';

  let categorySelect = document.querySelector('.test-info-section select');
  if (categorySelect) {
    let categoryName = test.category ? test.category.replace(/^[^a-zA-ZÀ-ỹ]*/, '') : '';
    categorySelect.value = categoryName;
  }

  let timeInput = document.querySelector('.flex-time input');
  if (timeInput) {
    let minute = test.time ? test.time.match(/\\d+/) : null;
    timeInput.value = minute ? minute[0] : 15;
  }

  // Nút lưu
  let saveBtn = document.querySelector('button[type="submit"], .btn-save');
  if (saveBtn) {
    saveBtn.onclick = function() {
      console.log('Cập nhật test ID:', testId);
      alert('Đã cập nhật bài test!');
    };
  }
};
