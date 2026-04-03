// 1. Dữ liệu mẫu ban đầu
let questions = [
  { id: 1, text: "What is the capital of France?" },
  { id: 2, text: "Which planet is known as the Red Planet?" },
];

let editingRow = null;
let rowToDelete = null;
let questionIdCounter = 3; // Tiếp theo là ID 3

// 2. Render bảng dữ liệu mẫu
const renderTable = () => {
  const tbody =
    document.getElementById("questionTableBody") ||
    document.querySelector("tbody");
  tbody.innerHTML = "";
  questions.forEach((q) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="text-center">${q.id}</td>
            <td>${q.text}</td>
            <td class="text-center">
                <div class="action-group">
                    <button class="btn-edit" onclick="editRow(this)">Sửa</button>
                    <button class="btn-delete" onclick="prepareDelete(this)">Xoá</button>
                </div>
            </td>
        `;
    tbody.appendChild(row);
  });
};

// 3. Hàm tạo một dòng trả lời (Checkbox + Input + Thùng rác)
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

// 4. Mở Popup (Mặc định 4 ô nếu thêm mới)
const openModal = (isEdit = false, row = null) => {
  const modal = document.getElementById("questionModal");
  const questionInput = document.getElementById("modalQuestionInput");
  const answerList = document.getElementById("modalAnswerList");

  modal.classList.add("active");
  answerList.innerHTML = ""; // Xóa sạch các ô cũ

  if (isEdit && row) {
    editingRow = row;
    document.getElementById("modalTitle").innerText = "Sửa câu hỏi";
    questionInput.value = row.cells[1].innerText;
    // Giả lập hiện 4 ô khi sửa
    for (let i = 0; i < 4; i++) addAnswerRow();
  } else {
    editingRow = null;
    document.getElementById("modalTitle").innerText = "Thêm câu hỏi";
    questionInput.value = "";
    // MẶC ĐỊNH TẠO 4 Ô TRẢ LỜI KHI THÊM MỚI
    for (let i = 0; i < 4; i++) addAnswerRow();
  }
};

const closeModal = () =>
  document.getElementById("questionModal").classList.remove("active");

// 5. Lưu câu hỏi vào mảng và Render lại bảng
const saveQuestion = () => {
  const questionText = document.getElementById("modalQuestionInput").value;
  if (!questionText.trim()) return alert("Vui lòng nhập câu hỏi!");

  if (editingRow) {
    const id = parseInt(editingRow.cells[0].innerText);
    const index = questions.findIndex((q) => q.id === id);
    questions[index].text = questionText;
  } else {
    questions.push({ id: questionIdCounter++, text: questionText });
  }
  renderTable();
  closeModal();
};

// 6. Xử lý Xóa với Popup xác nhận
const prepareDelete = (btn) => {
  rowToDelete = btn.closest("tr");
  document.getElementById("deleteModal").classList.add("active");
};

const closeDeleteModal = () =>
  document.getElementById("deleteModal").classList.remove("active");

document.getElementById("confirmDeleteBtn").onclick = () => {
  if (rowToDelete) {
    const id = parseInt(rowToDelete.cells[0].innerText);
    questions = questions.filter((q) => q.id !== id);
    renderTable();
  }
  closeDeleteModal();
};

const editRow = (btn) => openModal(true, btn.closest("tr"));

// 7. Khởi tạo khi trang load
window.onload = () => {
  renderTable(); // Vẽ 2 câu hỏi mẫu ra bảng

  // Gán sự kiện cho nút "Thêm câu hỏi" chính
  const btnAdd = document.querySelector(
    ".action-bar .btn-primary:not(.btn-save-all)",
  );
  if (btnAdd) btnAdd.onclick = () => openModal(false);

  // Đóng modal khi click ra ngoài vùng tối
  window.onclick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
      closeDeleteModal();
    }
  };
};
