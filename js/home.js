// Kiểm tra đăng nhập đơn giản
const checkLogin = () => {
  let currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "../pages/login.html";
    return;
  }
  try {
    JSON.parse(currentUser);
  } catch (e) {
    localStorage.removeItem("currentUser");
    window.location.href = "../pages/login.html";
  }
}

// Chạy kiểm tra khi trang load
window.onload = function() {
  checkLogin();

  // Tải danh sách test để hiển thị
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  let tests = JSON.parse(localStorage.getItem("tests")) || [];
  let quizInfos = document.querySelectorAll('.quiz-info');
  
  for (let i = 0; i < quizInfos.length && i < tests.length; i++) {
    let test = tests[i];
    let emoji = "📚";
    let categoryName = test.category.replace(/^[^a-zA-ZÀ-ỹ]*/, '');
    for (let j = 0; j < categories.length; j++) {
      if (categories[j].name === categoryName) {
        emoji = categories[j].emoji;
        break;
      }
    }
    quizInfos[i].innerHTML = '<div class="category">' + emoji + ' ' + categoryName + '</div><div class="quiz-title">' + test.name + '</div>';
  }

  // Tìm kiếm (đơn giản)
  let searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.oninput = function() {
      console.log('Đang tìm:', this.value);
    };
  }
};
