let somesome = JSON.parse(localStorage.getItem("anc"));
let smthsmth = JSON.parse(localStorage.getItem("ttts"));
function printCategory (){
    let catStr = `<option value="">Chọn danh mục</option>`;
    for(let i = 0;i<somesome.length;i++){
        catStr +=`            
            <option value="${somesome[i].category}">${somesome[i].category}</option>    
        `
    }
    document.getElementById("sorts").innerHTML = catStr;
}
printCategory();
function errorAnnouncement(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}

let question = [
    {id: 1, name: "What is the capital of France?", answers: []},
    {id: 2, name: "Which planet is known as the Red Planet?", answers: []},
    {id: 3, name: "Which planet is known as the Red Planet?", answers: []},
    {id: 4, name: "Which planet is known as the Red Planet?", answers: []},
    {id: 5, name: "Which planet is known as the Red Planet?", answers: []},

]
function showUp(){
    let str = "";
    for(let i =0;i<question.length;i++){
        str+=`
            <tr class="${i%2==0? 'odd' : ''}">
                        <td class="num">${i+1}</td>

                        <td>${question[i].name}</td>
                        <td class="grBtn">
                            <button id="updBtn" onclick = "clickUpd(${question[i].id})">Sửa</button>
                            <button id="delBtn" onclick = "clickDel(${question[i].id})">Xoá</button>
                        </td>
                    </tr>
        `
    }
    document.getElementById("tMain").innerHTML = str;
}
showUp();
function saveClick(){
    let tName = document.getElementById("tName").value.trim();
    let tCat = document.getElementById("sorts").value.trim();
    let tTime = document.getElementById("times").value.trim();
    if(tName.length==0){
        errorAnnouncement(".error-msg","Tên bài test không được để trống","block");
        return;
    }
        errorAnnouncement(".error-msg","","none");
    if(tCat.length == 0){
        errorAnnouncement(".error-msg","Tên danh mục không được để trống","block");
        return;


    }
        errorAnnouncement(".error-msg","","none");
    if(tTime.length ==0){
        errorAnnouncement(".error-msg","Thời gian làm không được để trống","block");
        return;

        
    }
        errorAnnouncement(".error-msg","","none");
        let createId = smthsmth.length;
   let addInto = {
            id: ++createId,
            name: tName,
            category: tCat,
            question: question.length,
            time: tTime + ` min`,
            detailQuestion: question,
   }
   smthsmth.push(addInto);
   localStorage.setItem("ttts", JSON.stringify(smthsmth));
   window.location.href ="./testManager.html"
}
let editId = null; 
function addClick() {
    editId = null;
    document.querySelector(".modal-header h3").innerText = "Thêm câu hỏi";
    document.getElementById("testName").value = "";

    document.getElementById("answerContainer").innerHTML = `
        <div class="answer-group">
            <div class="check-box-wrapper">
                <input type="checkbox" class="is-correct">
            </div>
            <input type="text" placeholder="Nhập câu trả lời" class="answer-input">
            <button class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `; 
    document.getElementById("testModal").style.display = "flex";
}

function addAnswerRow() {
    const container = document.getElementById("answerContainer");
    const div = document.createElement("div");
    div.className = "answer-group";
    div.innerHTML = `
        <div class="check-box-wrapper">
            <input type="checkbox" class="is-correct">
        </div>
        <input type="text" placeholder="Nhập câu trả lời" class="answer-input">
        <button class="delete-btn" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    `;
    container.appendChild(div);
}

function saveModal() {
    let questionName = document.getElementById("testName").value.trim();
    let answerRows = document.querySelectorAll(".answer-group"); 
    let answers = [];

    answerRows.forEach(row => {
        let text = row.querySelector(".answer-input").value.trim();
        let correct = row.querySelector(".is-correct").checked;
        if (text) {
            answers.push({ text: text, correct: correct });
        }
    });

    if (!questionName || answers.length === 0) {
        alert("Vui lòng nhập câu hỏi và ít nhất một câu trả lời!");
        return;
    }

    if (editId === null) {
        question.push({
            id: Date.now(),
            name: questionName,
            answers: answers 
        });
    } else {
        let idx = question.findIndex(q => q.id === editId);
        if (idx !== -1) {
            question[idx].name = questionName;
            question[idx].answers = answers;
        }
    }
    
    showUp();
    closeModal();
}
function closeModal() {
    document.getElementById("testModal").style.display = "none";
}
let idToDelete = null;

function clickDel(id) {
    idToDelete = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

function confirmDelete() {
    if (idToDelete !== null) {
        question = question.filter(t => t.id !== idToDelete); 
        showUp(); 
        closeDeleteModal();
    }
    idToDelete = null;
}

showUp();

window.onclick = function (event) {
    let testModal = document.getElementById("testModal");
    let deleteModal = document.getElementById("deleteModal");
    if (event.target == testModal) closeModal();
    if (event.target == deleteModal) closeDeleteModal();
}
function clickUpd(id) {
    editId = id;
    let item = question.find(q => q.id === id);
    if (!item) return;

    document.querySelector(".modal-header h3").innerText = "Sửa câu hỏi";
    document.getElementById("testName").value = item.name;

    let container = document.getElementById("answerContainer");
    container.innerHTML = ""; 

    if (item.answers && item.answers.length > 0) {
        item.answers.forEach(ans => {
            const div = document.createElement("div");
            div.className = "answer-group";
            div.innerHTML = `
                <div class="check-box-wrapper">
                    <input type="checkbox" class="is-correct" ${ans.correct ? 'checked' : ''}>
                </div>
                <input type="text" placeholder="Nhập câu trả lời" class="answer-input" value="${ans.text}">
                <button class="delete-btn" onclick="this.parentElement.remove()">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            container.appendChild(div);
        });
    } else {
        addAnswerRow(); 
    }
    document.getElementById("testModal").style.display = "flex";
}
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userLogin");
    window.location.href = "../index/logIn.html";
}