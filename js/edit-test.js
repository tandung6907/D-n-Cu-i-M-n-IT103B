const mockTests = [
  { id: 1, name: "History Quiz", category: "Lịch sử", time: "10" },
  { id: 2, name: "Science Challenge", category: "Khoa học", time: "15" },
  { id: 3, name: "Entertainment Trivia", category: "Khoa học", time: "5" },
];

let questions = [];
let editingRow = null;
let questionIdCounter = 3;
let STORAGE_KEY = "";

const saveToLocalStorage = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      questions,
      questionIdCounter,
    }),
  );
};

const loadFromLocalStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    questions = parsed.questions || [];
    questionIdCounter = Math.max(3, parsed.questionIdCounter || 3);
    renderTable();
  }
};

const getQuestionsFromTable = () => {
  const tbody = document.querySelector("tbody");
  const rows = tbody.querySelectorAll("tr");
  questions = Array.from(rows).map((row) => ({
    id: parseInt(row.cells[0].innerText),
    text: row.cells[1].innerText,
  }));
  questionIdCounter =
    Math.max(questionIdCounter, ...questions.map((q) => q.id)) + 1;
};

const renderTable = () => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  questions.forEach((q) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td class="text-center">${q.id}</td>
      <td>${q.text}</td>
      <td class="text-center">
        <div class="action-group">
          <button class="btn-edit" onclick="editCurrentRow(this)">Sửa</button>
          <button class="btn-delete" onclick="prepareDelete(this)">Xoá</button>
        </div>
      </td>
    `;
  });
};

const checkLogin = () => {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../pages/login.html";
  }
};

const addAnswerRow = (val = "") => {
  const answerList = document.getElementById("modalAnswerList");
  const div = document.createElement("div");
  div.className = "answer-item-row";
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

const saveQuestion = () => {
  const text = document.getElementById("modalQuestionInput").value;
  if (!text.trim()) return createToast("error", "Vui lòng nhập câu hỏi!");

  if (editingRow) {
    const id = parseInt(editingRow.cells[0].innerText);
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) questions[index].text = text;
  } else {
    questions.push({ id: questionIdCounter++, text: text });
  }
  renderTable();
  closeModal();
  saveToLocalStorage();
  createToast("success", "Lưu câu hỏi thành công!");
};

const saveTest = () => {
  const name = document.querySelector(
    '.test-info-section input[type="text"]',
  ).value;
  const category = document.querySelector(".test-info-section select").value;
  const time = document.querySelector(".flex-time input").value;

  if (!name.trim())
    return createToast("error", "Tên bài test không được để trống!");

  let allTests = JSON.parse(localStorage.getItem("tests")) || mockTests;
  let urlParams = new URLSearchParams(window.location.search);
  let testId = urlParams.get("id") || 1;

  const index = allTests.findIndex((t) => t.id == testId);
  if (index !== -1) {
    allTests[index].name = name;
    allTests[index].category = category;
    allTests[index].time = time;
    allTests[index].questions = questions.length;
  }

  localStorage.setItem("tests", JSON.stringify(allTests));
  saveToLocalStorage();
  createToast("success", "Lưu bài test thành công!");

  setTimeout(() => {
    window.location.href = "./test-manager.html";
  }, 1500);
};

const toggleDeleteModal = (show) =>
  document.getElementById("deleteModal").classList.toggle("active", show);

const prepareDelete = (btn) => {
  editingRow = btn.closest("tr");
  toggleDeleteModal(true);
};

const confirmDeleteRow = () => {
  if (editingRow) {
    const id = parseInt(editingRow.cells[0].innerText);
    questions = questions.filter((q) => q.id !== id);
    renderTable();
  }
  toggleDeleteModal(false);
  saveToLocalStorage();
  createToast("success", "Xóa câu hỏi thành công!");
};

const editCurrentRow = (btn) => openModal(true, btn.closest("tr"));

const renderCategoryOptions = () => {
  const categorySelect = document.querySelector(".test-info-section select");
  if (!categorySelect) {
    return;
  }
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';

  categories.forEach((cat) => {
    const option = document.createElement("option");
    const fullCategoryName = `${cat.emoji} ${cat.name}`;
    option.value = fullCategoryName;
    option.textContent = fullCategoryName;
    categorySelect.appendChild(option);
  });
};

window.onload = function () {
  checkLogin();
  renderCategoryOptions();

  let urlParams = new URLSearchParams(window.location.search);
  let testId = urlParams.get("id") || 1;
  STORAGE_KEY = `editTestQuestions_${testId}`;

  getQuestionsFromTable();
  loadFromLocalStorage();

  let allTests = JSON.parse(localStorage.getItem("tests")) || mockTests;
  let testData = allTests.find((t) => t.id == testId);

  if (testData) {
    const nameInput = document.querySelector(
      '.test-info-section input[type="text"]',
    );
    if (nameInput) nameInput.value = testData.name;

    const categorySelect = document.querySelector(".test-info-section select");
    if (categorySelect) {
      if (testData.category) {
        categorySelect.value = testData.category;
        if (categorySelect.selectedIndex <= 0) {
          for (let i = 0; i < categorySelect.options.length; i++) {
            if (
              testData.category.includes(categorySelect.options[i].text) ||
              categorySelect.options[i].text.includes(testData.category)
            ) {
              categorySelect.selectedIndex = i;
              break;
            }
          }
        }
      } else {
        categorySelect.selectedIndex = 0;
      }
    }

    const timeInput = document.querySelector(".flex-time input");
    if (timeInput) timeInput.value = parseInt(testData.time);
  }

  const addBtn = document.querySelector(
    ".action-bar .btn-primary:not(.btn-save-all)",
  );
  if (addBtn) addBtn.onclick = () => openModal(false);

  const btnSaveAll = document.querySelector(".btn-save-all");
  if (btnSaveAll) btnSaveAll.onclick = saveTest;

  document
    .querySelectorAll(".btn-edit")
    .forEach((btn) => (btn.onclick = () => editCurrentRow(btn)));
  document
    .querySelectorAll(".btn-delete")
    .forEach((btn) => (btn.onclick = () => prepareDelete(btn)));

  window.onclick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
      toggleDeleteModal(false);
    }
  };
};

window.onbeforeunload = saveToLocalStorage;
