// 1. Mảng dữ liệu mẫu
const mockTests = [
  { id: 1, name: "History Quiz", category: "Lịch sử", time: "10" },
  { id: 2, name: "Science Challenge", category: "Khoa học", time: "15" },
  { id: 3, name: "Entertainment Trivia", category: "Khoa học", time: "5" },
];

let editingRow = null;
let questionIdCounter = 3;

// 2. Kiểm tra đăng nhập
const checkLogin = () => {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../pages/login.html";
  }
};

// 3. Hàm tạo dòng câu trả lời trong Modal (mặc định 4 ô)
const addAnswerRow = (val = "") => {
  const answerList = document.getElementById("modalAnswerList");
  const div = document.createElement("div");
  div.className = "answer-item-row"; // Đổi tên class để tránh trùng lặp style cũ
  div.innerHTML = `
        <div class="checkbox-section">
            <input type="checkbox" class="answer-checkbox">
        </div>
        <input type="text" placeholder="Nhập câu trả lời" class="answer-input-field" value="${val}">
        <button class="btn-remove-answer-row" onclick="this.parentElement.remove()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </button>
    `;
  answerList.appendChild(div);
};

// 4. Mở/Đóng Modal
const openModal = (isEdit = false, row = null) => {
  const modal = document.getElementById("questionModal");
  const input = document.getElementById("modalQuestionInput");
  const list = document.getElementById("modalAnswerList");

  modal.classList.add("active");
  list.innerHTML = "";

  if (isEdit && row) {
    editingRow = row;
    document.getElementById("modalTitle").innerText = "Sửa câu hỏi";
    input.value = row.cells[1].innerText;
    for (let i = 0; i < 4; i++) addAnswerRow();
  } else {
    editingRow = null;
    document.getElementById("modalTitle").innerText = "Thêm câu hỏi";
    input.value = "";
    for (let i = 0; i < 4; i++) addAnswerRow();
  }
};

const closeModal = () =>
  document.getElementById("questionModal").classList.remove("active");

// 5. Lưu từ Modal vào bảng
const saveQuestion = () => {
  const text = document.getElementById("modalQuestionInput").value;
  if (!text.trim()) return alert("Vui lòng nhập câu hỏi!");

  if (editingRow) {
    editingRow.cells[1].innerText = text;
  } else {
    const tbody = document.querySelector("tbody");
    const row = tbody.insertRow();
    row.innerHTML = `
            <td class="text-center">${questionIdCounter++}</td>
            <td>${text}</td>
            <td class="text-center">
                <div class="action-group">
                    <button class="btn-edit" onclick="editCurrentRow(this)">Sửa</button>
                    <button class="btn-delete" onclick="prepareDelete(this)">Xoá</button>
                </div>
            </td>
        `;
  }
  closeModal();
};

// 6. Xử lý Xóa
const toggleDeleteModal = (show) =>
  document.getElementById("deleteModal").classList.toggle("active", show);

const prepareDelete = (btn) => {
  editingRow = btn.closest("tr");
  toggleDeleteModal(true);
};

const confirmDeleteRow = () => {
  if (editingRow) editingRow.remove();
  toggleDeleteModal(false);
};

const editCurrentRow = (btn) => openModal(true, btn.closest("tr"));

// 7. Khởi chạy khi trang load
window.onload = function () {
  checkLogin();

  // --- LẤY ID TỪ URL VÀ ĐIỀN DỮ LIỆU ---
  let urlParams = new URLSearchParams(window.location.search);
  let testId = urlParams.get("id") || 1; // Mặc định lấy id 1 nếu không có tham số

  // Tìm kiếm trong mảng mockTests vừa tạo ở trên
  let testData = mockTests.find((t) => t.id == testId);

  if (testData) {
    // Điền tên bài test
    const nameInput = document.querySelector(
      '.test-info-section input[type="text"]',
    );
    if (nameInput) nameInput.value = testData.name;

    // Điền danh mục (so khớp text bên trong mảng với các option)
    const categorySelect = document.querySelector(".test-info-section select");
    if (categorySelect) {
      for (let i = 0; i < categorySelect.options.length; i++) {
        // So sánh chuỗi
        if (
          testData.category.includes(categorySelect.options[i].text) ||
          categorySelect.options[i].text.includes(testData.category)
        ) {
          categorySelect.selectedIndex = i;
          break;
        }
      }
    }

    // Điền thời gian
    const timeInput = document.querySelector(".flex-time input");
    if (timeInput) timeInput.value = parseInt(testData.time);
  }

  const addBtn = document.querySelector(
    ".action-bar .btn-primary:not(.btn-save-all)",
  );
  if (addBtn) addBtn.onclick = () => openModal(false);

  document
    .querySelectorAll(".btn-edit")
    .forEach((btn) => (btn.onclick = () => editCurrentRow(btn)));
  document
    .querySelectorAll(".btn-delete")
    .forEach((btn) => (btn.onclick = () => prepareDelete(btn)));

  document.querySelector(".btn-save-all").onclick = () =>
    alert("Đã cập nhật bài test thành công!");

  window.onclick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
      toggleDeleteModal(false);
    }
  };
};
