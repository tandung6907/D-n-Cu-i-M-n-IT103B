let somesome = JSON.parse(localStorage.getItem("ttts"))
let tests = somesome ? somesome : [
    {
        id: 1,
        name: "History Quiz",
        category: "📚 Lịch sử",
        question: 15,
        time: "10 min",
    },
    {
        id: 2,
        name: "Science Challenge",
        category: "🧠 Khoa học",
        question: 20,
        time: "15 min",
    },
    {
        id: 3,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
    {
        id: 4,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
    {
        id: 5,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
    {
        id: 6,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
    {
        id: 7,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
    {
        id: 8,
        name: "Entertainment Trivia",
        category: "🎤 Giải trí",
        question: 10,
        time: "5 min",
    },
]
let currentPage = 1;
let perPage = 5; 
let totalPages = 0;
function showUp() {
    let start = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let currentTests = tests.slice(start, end);
    let str = "";
    for (let i = 0; i < currentTests.length; i++) {
        str += `
            <tr class="${i % 2 === 0 ? 'odd' : ''}">
            <td class="num">${i + 1}</td>
                        <td>${currentTests[i].name}</td>
                        <td>${currentTests[i].category}</td>
                        <td>${currentTests[i].question}</td>
                        <td>${currentTests[i].time}</td>
                        <td class="grBtn">
                            <button id="updBtn" onclick = "clickUpd(${currentTests[i].id})">Sửa</button>
                            <button id="delBtn" onclick = "clickDel(${currentTests[i].id})">Xoá</button>
                        </td>
                    </tr>
        `
    }
    document.getElementById("toc").innerHTML = str;
    renderPagination();
    localStorage.setItem("ttts", JSON.stringify(tests))
}
showUp();
function searchItems() {
    let result = document.getElementById("found").value.toLowerCase();
    let original = [...tests];
    let match = tests.filter((value) => {
        return value.name.toLowerCase().includes(result);
    })
    tests = match;
    showUp();
    tests = original;
}
let editId = null;

function clickUpd(id) {
    editId = id;
    document.querySelector(".modal-header h3").innerText = "Sửa bài test";
    
    let item = tests.find(val => val.id === id);
    if (item) {
        document.getElementById("testName").value = item.name;
        document.getElementById("testCategory").value = item.category;
        document.getElementById("testQuestion").value = item.question;
        document.getElementById("testTime").value = item.time;
    }
    document.getElementById("testModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("testModal").style.display = "none";
}

function saveModal() {
    let name = document.getElementById("testName").value.trim();
    let category = document.getElementById("testCategory").value.trim();
    let question = document.getElementById("testQuestion").value.trim();
    let time = document.getElementById("testTime").value.trim();

    if (!name || !category || !question || !time) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }

    let index = tests.findIndex(val => val.id == editId);
    if (index !== -1) {
        tests[index].name = name;
        tests[index].category = category;
        tests[index].question = question;
        tests[index].time = time + ` min`;
    }

    showUp(); 
    closeModal();
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
        tests = tests.filter(t => t.id !== idToDelete); 
        showUp();
        closeDeleteModal();
    }
}

window.onclick = function (event) {
    let testModal = document.getElementById("testModal");
    let deleteModal = document.getElementById("deleteModal");
    if (event.target == testModal) closeModal();
    if (event.target == deleteModal) closeDeleteModal();
}
function sortItems (){
    let sortBy = document.getElementById("sorts").value;
    switch(sortBy){
        case "1":
            let result1 = tests.sort((value1, value2)=>{
                return value1.question - value2.question;
            })
            tests = result1;
            showUp();
            break;
        case "2":
            let result2 = tests.sort((value1, value2)=>{
                return value2.question - value1.question;
            })
            tests = result2;
            showUp();
            break;
        case "3":
            let result3 = tests.sort((value1, value2)=>{
                return parseInt(value1.time) - parseInt(value2.time);
            })
            tests = result3;
            showUp();
        break;
        case "4":
            let result4 = tests.sort((value1, value2)=>{
                return parseInt(value2.time) - parseInt(value1.time);
            })
            tests = result4;
            showUp();
            break;
        default:
            let result5 = tests.sort((value1, value2)=>{
                return value1.id - value2.id;
            })
            tests = result5;
            showUp();
        break;
    }
}
function renderPagination() {
    totalPages = Math.ceil(tests.length / perPage);
    let paginationStr = "";
    paginationStr += `<button class="special ${currentPage === 1 ? 'disabled' : ''}" 
                      onclick="changePage(${currentPage - 1})">&lt;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `<button class="${i === currentPage ? 'current' : 'other'}" 
                          onclick="changePage(${i})">${i}</button>`;
    }
    paginationStr += `<button class="other next ${currentPage === totalPages ? 'disabled' : ''}" 
                      onclick="changePage(${currentPage + 1})">&gt;</button>`;

    document.querySelector(".pages").innerHTML = paginationStr;
}
function changePage(page) {
    if (page < 1 || page > totalPages) return; 
    currentPage = page;
    showUp();
}