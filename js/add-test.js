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

  // Tải danh mục vào select
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  let select = document.querySelector('select');
  for (let i = 0; i < categories.length; i++) {
    let option = document.createElement('option');
    option.text = categories[i].name;
    option.value = categories[i].name;
    select.appendChild(option);
  }

  // Nút thêm câu hỏi
  let addBtn = document.querySelector('.btn-primary:not(.btn-save-all)');
  let questionId = 1;
  if (addBtn) {
    addBtn.onclick = function() {
      let tbody = document.querySelector('tbody');
      let row = document.createElement('tr');
      row.innerHTML = '<td class="text-center">' + questionId + '</td><td><input type="text" placeholder="Nhập câu hỏi" class="form-control"></td><td class="text-center"><div class="action-group"><button class="btn-edit">Sửa</button><button class="btn-delete">Xóa</button></div></td>';
      tbody.appendChild(row);
      questionId++;
    };
  }

  // Nút lưu
  let saveBtn = document.querySelector('.btn-save-all');
  if (saveBtn) {
    saveBtn.onclick = function() {
      console.log('Lưu bài test');
      alert('Đã lưu bài test!');
    };
  }
};
