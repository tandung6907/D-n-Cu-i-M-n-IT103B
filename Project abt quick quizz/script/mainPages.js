let smthsmth = JSON.parse(localStorage.getItem("ttts")) || [];

function errors(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
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

smthsmth = smthsmth.map(item => {
    if (item.play === undefined) {
        item.play = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    }
    return item;
});

let currentPage = 1;
let perPage = 8;
const originalData = [...smthsmth];

function showUp(){
    let str = "";
    let start = (currentPage - 1) * perPage;
    let end = start + perPage;
    let itemsOnPage = smthsmth.slice(start, end);

    if (itemsOnPage.length === 0) {
        document.getElementsByClassName("cards")[0].innerHTML = "<p>Không tìm thấy câu đố nào.</p>";
        return;
    }
    for (let i = 0; i < itemsOnPage.length; i++) {
        str += `
            <div class="containers">
                <div class="poster">
                    <img src="../img/20260402-150420.jpg" alt="poster">
                </div>
                <div class="information">
                    <p>${itemsOnPage[i].category}</p>
                    <h3>${itemsOnPage[i].name}</h3>
                    <p>${itemsOnPage[i].question} câu hỏi - ${itemsOnPage[i].play} lượt chơi</p>
                </div>
                <div class="playBtnss">
                    <button class="playBtn" onclick="goToQuiz(${start + i})">Chơi</button>
                </div>
            </div>`;
    }
    document.getElementsByClassName("cards")[0].innerHTML = str;
    renderPagination();
}
showUp();

function renderPagination() {
    let totalPages = Math.ceil(smthsmth.length / perPage);
    let paginationStr = "";
    paginationStr += `<button class="special" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>`;
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `
            <button class="${i === currentPage ? 'current' : 'other'}" onclick="changePage(${i})">
                ${i}
            </button>`;
    }
    paginationStr += `<button class="other next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>`;

    document.querySelector(".pages").innerHTML = paginationStr;
}

function changePage(page) {
    currentPage = page;
    showUp();
}

function findResult() {
    let inputElement = document.querySelector(".findingNemo");
    let result = inputElement.value.toLowerCase();
    let origin = JSON.parse(localStorage.getItem("ttts")) || [];
    
    let match = origin.filter((value) => {
        return value.name.toLowerCase().includes(result) || 
               value.category.toLowerCase().includes(result);
    });
    smthsmth = match;
    currentPage = 1;
    showUp();
}
showUp();

function ascClick(){
    document.querySelector('.asc').classList.add('active');
    document.querySelector('.desc').classList.remove('active');
    smthsmth.sort((a, b) => a.play - b.play);
    currentPage = 1;
    showUp();
}

function descClick(){
    document.querySelector('.desc').classList.add('active');
    document.querySelector('.asc').classList.remove('active');
    smthsmth.sort((a, b) => b.play - a.play);
    currentPage = 1;
    showUp();
}

function goToQuiz(index){
    let selectedQuiz = smthsmth[index];
    selectedQuiz.play = (selectedQuiz.play || 0) + 1;
    let fullData = JSON.parse(localStorage.getItem("ttts")) || [];
    let originalIndex = fullData.findIndex(t => t.id === selectedQuiz.id);
    if(originalIndex !== -1) {
        fullData[originalIndex].play = selectedQuiz.play;
        localStorage.setItem("ttts", JSON.stringify(fullData));
    }
    localStorage.setItem("currentQuiz", JSON.stringify(selectedQuiz));
    window.location.href = "./doTest.html";
}

function randomPlay(){
     if (smthsmth.length === 0) {
        Swal.fire("Lỗi", "Không có bài test nào để chơi!", "error");
        return;
    }
    let randomIndex = Math.floor(Math.random() * smthsmth.length);
    goToQuiz(randomIndex);
}