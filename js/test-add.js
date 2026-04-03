const TEST_KEY = "tests";
const CATEGORY_KEY = "categories";

// KHAI BÁO BIẾN
let tests = [];
let nextTestId = 1;

let questions = [];
let nextQuesId = 1;
let editingQuesId = null;
let deleteQuesId = null;

let testName, testImg, testTime, previewImg;
let listCategory, fileName, quesName;
let overlay, popupForm, popupConfirm, confirmName;
let questionList;
let currentBase64Img = "";

let errorTest, errorTime, errorQuestion, missingQuestion;

// LOCAL STORAGE
function saveTestToLocalStorage() {
  localStorage.setItem(TEST_KEY, JSON.stringify(tests));
}

function loadTestFromLocalStorage() {
  const data = localStorage.getItem(TEST_KEY);
  return data ? JSON.parse(data) : [];
}

function loadCategoryFromLocalStorage() {
  const data = localStorage.getItem(CATEGORY_KEY);
  return data ? JSON.parse(data) : [];
}

// INIT
window.onload = function () {
  tests = loadTestFromLocalStorage();
  if (tests.length > 0) {
    nextTestId = Math.max(...tests.map((t) => t.id)) + 1;
  }

  // DOM
  testName = document.getElementById("test-name");
  testImg = document.getElementById("test-img");
  testTime = document.getElementById("test-time");
  listCategory = document.getElementById("test-category");
  previewImg = document.getElementById("preview-img");
  fileName = document.getElementById("file-name");
  overlay = document.getElementById("overlay");
  popupForm = document.getElementById("popup-form");
  popupConfirm = document.getElementById("popup-confirm");
  quesName = document.getElementById("question-name");
  questionList = document.querySelector(".question-test");
  errorTest = document.querySelector(".error-test");
  errorQuestion = document.querySelector(".error-question");
  errorTime = document.querySelector(".error-time");
  errorIcon = document.querySelector(".error-icon");
  missingQuestion = document.querySelector(".missing-question");
  confirmName = document.getElementById("confirm-name");

  renderCategories(loadCategoryFromLocalStorage());
  renderQuestions();

  // EVENTS
  document.querySelector(".btn-add").onclick = openAddPopup;
  document.querySelector(".btn-save").onclick = handleSubmitTest;

  document.getElementById("btn-save").onclick = handleSubmitQuestion;
  document.getElementById("btn-confirm-delete").onclick = handleDeleteQuestion;

  document.getElementById("popup-close").onclick = closePopup;
  document.getElementById("btn-cancel").onclick = closePopup;
  document.getElementById("btn-cancel-delete").onclick = closeConfirm;

  overlay.onclick = () => {
    closePopup();
    closeConfirm();
  };

  // UPDATE PREVIEW AND SAVE IMGG4
  testImg.onchange = function () {
    const file = this.files[0];
    if (!file) {
      currentBase64Img = "";
      return;
    }

    fileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      currentBase64Img = e.target.result;
      previewImg.src = currentBase64Img;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  };
};

// RENDER CATEFORY
function renderCategories(categories) {
  listCategory.innerHTML = "";

  if (categories.length === 0) {
    listCategory.innerHTML = `<option disabled>Chưa có danh mục</option>`;
    return;
  }

  categories.forEach((c) => {
    listCategory.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

// RENDER QUESTIONS
function renderQuestions() {
  if (!questionList) return;

  if (questions.length === 0) {
    questionList.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;color:#888;">
          Chưa có câu hỏi nào...
        </td>
      </tr>`;
    return;
  }

  questionList.innerHTML = questions
    .map(
      (q) => `
      <tr>
        <td class="col-id">${q.id}</td>
        <td class="col-name">${q.name}</td>
        <td class="col-action">
          <button class="btn-edit" onclick="openEditPopup(${q.id})">Sửa</button>
          <button class="btn-delete" onclick="openConfirmDelete(${q.id})">Xoá</button>
        </td>
      </tr>`,
    )
    .join("");
}

// POPUP
function openAddPopup() {
  editingQuesId = null;
  quesName.value = "";
  overlay.classList.add("active");
  popupForm.classList.add("active");
}

function openEditPopup(id) {
  const q = questions.find((x) => x.id === id);
  if (!q) return;

  editingQuesId = id;
  quesName.value = q.name;

  overlay.classList.add("active");
  popupForm.classList.add("active");
}

function closePopup() {
  overlay.classList.remove("active");
  popupForm.classList.remove("active");
}

// DELETE POPUP
function openConfirmDelete(id) {
  const item = questions.find((p) => p.id === id);
  if (!item) return;
  deleteQuesId = id;
  confirmName.textContent = item.name;
  overlay.classList.add("active");
  popupConfirm.classList.add("active");
}

function closeConfirm() {
  overlay.classList.remove("active");
  popupConfirm.classList.remove("active");
}

// DELETE QUESTION
function handleDeleteQuestion() {
  questions = questions.filter((q) => q.id !== deleteQuesId);
  renderQuestions();
  closeConfirm();
}

// SAVE QUESTION
function handleSubmitQuestion() {
  const name = quesName.value.trim();

  if (!validateQuestion(name)) return;

  // EDIT
  if (editingQuesId !== null) {
    const q = questions.find((x) => x.id === editingQuesId);
    if (q) q.name = name;
  } else {
    // ADD
    questions.push({ id: nextQuesId++, name });
  }

  renderQuestions();
  closePopup();
}

// SAVE TEST
function handleSubmitTest() {
  const name = testName.value.trim();
  const time = testTime.value.trim();

  if (!validateTest(name, time)) return;

  if (!validateQuestionList()) return;

  const selected = listCategory.options[listCategory.selectedIndex];

  const newTest = {
    id: nextTestId++,
    name,
    category: selected?.textContent || "",
    categoryId: Number(selected?.value) || null,
    questions: [...questions],
    time,
    img: currentBase64Img, // Đã có dữ liệu ảnh
  };

  tests.push(newTest);
  saveTestToLocalStorage();

  // RESET
  questions = [];
  // nextQuesId = 1;
  currentBase64Img = "";
  renderQuestions();

  testName.value = "";
  testTime.value = "";
  testImg.value = "";
  previewImg.style.display = "none";
  fileName.textContent = "Chưa chọn file";

  handleSave();
}

// VALIDATE TEST
function validateTest(name, time) {
  errorTest.style.display = "none";
  errorTime.style.display = "none";
  errorIcon.style.display = "none";

  if (name.length === 0) {
    errorTest.style.display = "block";
    errorTest.textContent = "Nhập tên bài test!";
    return false;
  }

  const duplicated = tests.some((p) => p.name === name);
  if (duplicated) {
    errorTest.style.display = "block";
    errorTest.textContent = "Tên bài test đã tồn tại!";
    return false;
  }

  if (!time || time.length === 0) {
    errorTime.style.display = "block";
    errorTime.textContent = "Nhập thời gian làm bài!";
    return false;
  }

  if (Number(time) <= 0) {
    errorTime.style.display = "block";
    errorTime.textContent = "Thời gian không âm!";
    return false;
  }

  if (!currentBase64Img) {
    errorIcon.style.display = "block";
    errorIcon.textContent = "Chưa chọn icon!";
    return false;
  }

  errorTest.style.display = "none";
  errorTime.style.display = "none";
  errorIcon.style.display = "none";
  return true;
}

// VALIDATE QUESTION
function validateQuestion(questions) {
  errorQuestion.style.display = "none";

  if (questions.length === 0) {
    errorQuestion.style.display = "block";
    errorQuestion.textContent = "Nhập ít nhất 1 câu hỏi!";
    return false;
  }

  if (questions.length < 10 || questions.length > 100) {
    errorQuestion.style.display = "block";
    errorQuestion.textContent = "Mỗi câu hỏi yêu cầu 10-100 ký tự!";
    return false;
  }

  errorQuestion.style.display = "none";
  return true;
}

function validateQuestionList() {
  missingQuestion.style.display = "none";

  if (questions.length === 0) {
    missingQuestion.style.display = "block";
    missingQuestion.textContent = "Danh sách câu hỏi không được trống!";
    return false;
  }

  missingQuestion.style.display = "none";
  return true;
}

function handleSave() {
  document.getElementById("popup-success").classList.add("active");

  setTimeout(() => {
    window.location.href = "../pages/test-manager.html";
  }, 1000);
}
