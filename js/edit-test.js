let questions = [];
let editingRow = null;
let testId = null;
let STORAGE_KEY = "";

const checkLogin = () => {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../pages/login.html";
  }
};

const loadFromLocalStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    questions = parsed.questions || [];
  }
};

const saveToLocalStorage = () => {
  if (STORAGE_KEY) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions }));
  }
};

const renderTable = () => {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  questions.forEach((q, index) => {
    const row = tbody.insertRow();
    
    row.innerHTML = `
            <td class="text-center">${q.id || index + 1}</td>
            <td>${q.text}</td>
            <td class="text-center">
                <div class="action-group">
                    <button class="btn-edit" onclick="editCurrentRow(this)">Sửa</button>
                    <button class="btn-delete" onclick="prepareDelete(this)">Xoá</button>
                </div>
            </td>`;
  });
};

const addAnswerRow = (val = "", isCorrect = false) => {
  const answerList = document.getElementById("modalAnswerList");
  const div = document.createElement("div");
  div.className = "answer-item-row";
  div.innerHTML = `
        <div class="checkbox-section"><input type="checkbox" class="answer-checkbox" ${isCorrect ? "checked" : ""}></div>
        <input type="text" placeholder="Nhập câu trả lời" class="answer-input-field" value="${val}">
        <button class="btn-remove-answer-row" onclick="this.parentElement.remove()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </button>`;
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
    const qId = parseInt(row.cells[0].innerText);
    const qData = questions.find((q) => q.id === qId);

    document.getElementById("modalTitle").innerText = "Sửa câu hỏi";
    input.value = qData.text;

    if (qData.answers && qData.answers.length > 0) {
      qData.answers.forEach((ans) => addAnswerRow(ans.text, ans.isCorrect));
    } else {
      for (let i = 0; i < 4; i++) addAnswerRow();
    }
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

  const answerRows = document.querySelectorAll(".answer-item-row");
  const answers = [];
  answerRows.forEach((row) => {
    const aText = row.querySelector(".answer-input-field").value.trim();
    const isCorrect = row.querySelector(".answer-checkbox").checked;
    if (aText) answers.push({ text: aText, isCorrect });
  });

  if (answers.length < 2) return createToast("error", "Cần ít nhất 2 đáp án!");
  if (!answers.some((a) => a.isCorrect))
    return createToast("error", "Cần ít nhất 1 đáp án đúng!");

  if (editingRow) {
    const qId = parseInt(editingRow.cells[0].innerText);
    const index = questions.findIndex((q) => q.id === qId);
    if (index !== -1)
      questions[index] = { ...questions[index], text: text, answers: answers };
  } else {
    const nextId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    questions.push({ id: nextId, text: text, answers: answers });
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

  let allTests = JSON.parse(localStorage.getItem("tests")) || [];
  const index = allTests.findIndex((t) => t.id == testId);
  if (index !== -1) {
    allTests[index] = {
      ...allTests[index],
      name,
      category,
      time,
      questions: questions.length,
    };
    localStorage.setItem("tests", JSON.stringify(allTests));
    saveToLocalStorage();
    createToast("success", "Cập nhật bài test thành công!");
    setTimeout(() => {
      window.location.href = "./test-manager.html";
    }, 1500);
  }
};

const prepareDelete = (btn) => {
  editingRow = btn.closest("tr");
  document.getElementById("deleteModal").classList.add("active");
};

const confirmDeleteRow = () => {
  if (editingRow) {
    const id = parseInt(editingRow.cells[0].innerText);
    questions = questions.filter((q) => q.id !== id);
    renderTable();
    saveToLocalStorage();
    createToast("success", "Xóa câu hỏi thành công!");
  }
  document.getElementById("deleteModal").classList.remove("active");
};

const editCurrentRow = (btn) => openModal(true, btn.closest("tr"));

window.onload = function () {
  checkLogin();
  const urlParams = new URLSearchParams(window.location.search);
  testId = urlParams.get("id");
  if (!testId) return;

  STORAGE_KEY = `testQuestions_${testId}`;

  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const select = document.querySelector(".test-info-section select");
  if (select) {
    select.innerHTML = '<option value="">Chọn danh mục</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.emoji + " " + cat.name;
      option.textContent = cat.emoji + " " + cat.name;
      select.appendChild(option);
    });
  }

  const allTests = JSON.parse(localStorage.getItem("tests")) || [];
  const testData = allTests.find((t) => t.id == testId);
  if (testData) {
    document.querySelector('.test-info-section input[type="text"]').value =
      testData.name;
    document.querySelector(".test-info-section select").value =
      testData.category;
    document.querySelector(".flex-time input").value = testData.time;
  }

  loadFromLocalStorage();
  renderTable();

  document.querySelector(
    ".action-bar .btn-primary:not(.btn-save-all)",
  ).onclick = () => openModal(false);
  document.querySelector(".btn-save-all").onclick = saveTest;

  window.onclick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
      document.getElementById("deleteModal").classList.remove("active");
    }
  };
};
