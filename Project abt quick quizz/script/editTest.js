let somesome = JSON.parse(localStorage.getItem("anc")) || [];
let smthsmth = JSON.parse(localStorage.getItem("ttts")) || [];
const urlParams = new URLSearchParams(window.location.search);
const editTestId = urlParams.get('id');

function errors(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}

let question = [];
let currentPage = 1;
let perPage = 5;
let totalPages = 0;
let editId = null;
let idToDelete = null;

function printCategory() {
    let catStr = `<option value="">Chọn danh mục</option>`;
    for (let i = 0; i < somesome.length; i++) {
        catStr += `<option value="${somesome[i].category}">${somesome[i].category}</option>`;
    }
    document.getElementById("sorts").innerHTML = catStr;
}


window.onload = function () {
    printCategory();

    if (editTestId) {
        document.querySelector(".format h2").innerText = "Sửa bài test";
        let testItem = smthsmth.find(t => t.id == editTestId);
        if (testItem) {
            document.getElementById("tName").value = testItem.name;
            document.getElementById("sorts").value = testItem.category;
            document.getElementById("times").value = parseInt(testItem.time);
            if (testItem.detailQuestion) {
                question = [...testItem.detailQuestion];
            }
        }
    }
    showUp();
};

function showUp() {
    let start = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let currentQuestions = question.slice(start, end);
    let str = "";
    for (let i = 0; i < currentQuestions.length; i++) {
        let displayIndex = (currentPage - 1) * perPage + i + 1;
        str += `
            <tr class="${i % 2 == 0 ? 'odd' : ''}">
                <td class="num">${displayIndex}</td>
                <td>${currentQuestions[i].name}</td>
                <td class="grBtn">
                    <button id="updBtn" onclick="clickUpd(${currentQuestions[i].id})">Sửa</button>
                    <button id="delBtn" onclick="clickDel(${currentQuestions[i].id})">Xoá</button>
                </td>
            </tr>`;
    }
    document.getElementById("tMain").innerHTML = str;
    renderPagination();
}

function renderPagination() {
    totalPages = Math.ceil(question.length / perPage);
    let paginationStr = "";
    paginationStr += `<button class="special ${currentPage === 1 ? 'disabled' : ''}"
                      onclick="changePage(${currentPage - 1})">&lt;</button>`;
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `<button class="${i === currentPage ? 'current' : 'other'}"
                          onclick="changePage(${i})">${i}</button>`;
    }
    paginationStr += `<button class="other next ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}"
                      onclick="changePage(${currentPage + 1})">&gt;</button>`;
    let container = document.querySelector(".pages-container");
    if (container) {
        container.innerHTML = paginationStr;
    }
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    showUp();
}

function saveClick() {
    let tName = document.getElementById("tName").value.trim();
    let tCat = document.getElementById("sorts").value.trim(); 
    let tTime = document.getElementById("times").value.trim();
    let timeUnit = document.getElementById("timer").value === "true" ? "sec" : "min";
    let timeNum = parseInt(tTime);
    let categoryData = somesome.find(c => c.category === tCat);
    let categoryId = categoryData ? categoryData.id : null; 

    if (editTestId) {
        let index = smthsmth.findIndex(t => t.id == editTestId);
        if (index !== -1) {
            smthsmth[index].name = tName;
            smthsmth[index].category = tCat;
            smthsmth[index].categoryId = categoryId;
            smthsmth[index].time = tTime + " " + timeUnit;
            smthsmth[index].question = question.length;
            smthsmth[index].detailQuestion = question;
        }

    } else {
        let newId = smthsmth.length > 0 ? Math.max(...smthsmth.map(t => t.id)) + 1 : 1;
        smthsmth.push({
            id: newId,
            name: tName,
            category: tCat,
            categoryId: categoryId, 
            question: question.length,
            time: tTime + " " + timeUnit,
            detailQuestion: question,
            played: 0
        });
    }
    localStorage.setItem("ttts", JSON.stringify(smthsmth));
    Swal.fire({
        text: 'Lưu bài test thành công',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "../index/testManager.html";
    });
}

function addClick() {
    editId = null;
    document.querySelector(".modal-header h3").innerText = "Thêm câu hỏi";
    document.getElementById("testName").value = "";
    document.getElementById("answerContainer").innerHTML = "";
    addAnswerRow();
    document.getElementById("testModal").style.display = "flex";
}

function saveModal() {
   let qName = document.getElementById("testName").value.trim();
    let rows = document.querySelectorAll(".answer-group");
    let ansArr = [];
    rows.forEach(row => {
        let txt = row.querySelector(".answer-input").value.trim();
        let isCorrect = row.querySelector(".is-correct").checked;
        if (txt) ansArr.push({ text: txt, correct: isCorrect });
    });

    if (!qName) {
        Swal.fire('Thông báo', 'Vui lòng nhập nội dung câu hỏi!', 'info');
        return;
    }

    if (ansArr.length < 2) {
        Swal.fire({
            title: 'Thiếu câu trả lời',
            text: 'Mỗi câu hỏi cần ít nhất 2 phương án trả lời.',
            icon: 'error',
            confirmButtonText: 'Đã hiểu'
        });
        return;
    }
    let hasCorrect = ansArr.some(a => a.correct);
    if (!hasCorrect) {
        Swal.fire('Chú ý', 'Vui lòng chọn ít nhất một đáp án đúng cho câu hỏi này.', 'warning');
        return;
    }
    if (editId === null) {
        question.push({ id: Date.now(), name: qName, answers: ansArr });
        currentPage = Math.ceil(question.length / perPage);
    } else {
        let idx = question.findIndex(q => q.id === editId);
        if (idx !== -1) {
            question[idx].name = qName;
            question[idx].answers = ansArr;
        }
    }
    showUp();
    closeModal();
}

function addAnswerRow() {
    const div = document.createElement("div");
    div.className = "answer-group";
    div.innerHTML = `
        <div class="check-box-wrapper"><input type="checkbox" class="is-correct"></div>
        <input type="text" placeholder="Nhập câu trả lời" class="answer-input">
        <button class="delete-btn" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-trash-can"></i>
        </button>`;
    document.getElementById("answerContainer").appendChild(div);
}

function clickUpd(id) {
    editId = id;
    let item = question.find(q => q.id === id);
    if (!item) return;
    document.querySelector(".modal-header h3").innerText = "Sửa câu hỏi";
    document.getElementById("testName").value = item.name;
    let container = document.getElementById("answerContainer");
    container.innerHTML = "";
    item.answers.forEach(ans => {
        const div = document.createElement("div");
        div.className = "answer-group";
        div.innerHTML = `
            <div class="check-box-wrapper"><input type="checkbox" class="is-correct" ${ans.correct ? 'checked' : ''}></div>
            <input type="text" placeholder="Nhập câu trả lời" class="answer-input" value="${ans.text}">
            <button class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-trash-can"></i>
            </button>`;
        container.appendChild(div);
    });
    document.getElementById("testModal").style.display = "flex";
}

function clickDel(id) {
    idToDelete = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function confirmDelete() {
    if (idToDelete !== null) {
        question = question.filter(q => q.id !== idToDelete);
        const totalPagesAfterDel = Math.ceil(question.length / perPage);
        if (currentPage > totalPagesAfterDel && totalPagesAfterDel > 0) {
            currentPage = totalPagesAfterDel;
        }
        idToDelete = null; 
        showUp(); 
        closeDeleteModal();
}
}

function closeModal() {
    document.getElementById("testModal").style.display = "none";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

function errorAnnouncement(lass, ann, val) {
    let el = document.querySelector(lass);
    if (el) { el.style.display = val; el.textContent = ann; }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userLogin");
    Swal.fire({
      text: 'Đăng xuất tài khoản thành công',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    }).then(() => {
          window.location.href = "../index/logIn.html";
    });
}

window.onclick = function (event) {
    if (event.target == document.getElementById("testModal")) closeModal();
    if (event.target == document.getElementById("deleteModal")) closeDeleteModal();
}