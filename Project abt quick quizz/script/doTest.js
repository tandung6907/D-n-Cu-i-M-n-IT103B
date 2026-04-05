const quizData = JSON.parse(localStorage.getItem("currentQuiz"));

if (!quizData) {
    alert("Không tìm thấy dữ liệu câu đố!");
    window.location.href = "./mainPages.html";
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

let smthsmth = JSON.parse(localStorage.getItem("ttts")) || [];
let qt = quizData.detailQuestion || [];
let userAnswers = new Array(qt.length).fill(null).map(() => []);
let currentIndex = 0;
let totalSeconds = 0;

function renderNav() {
    let navContainer = document.querySelector(".groupOfQuestion");
    if (!navContainer) return;
    let str = "";
    for (let i = 0; i < qt.length; i++) {
        let isAnswered = (userAnswers[i] && userAnswers[i].length > 0) ? 'answered' : '';
        str += `<button class="aint ${isAnswered}" id="nav-btn-${i}" onclick="jumpToQuestion(${i})">${i + 1}</button>`;
    }
    navContainer.innerHTML = str;
}
function showQuestion(index) {
    if (!qt || !qt[index]) return;

    let cq = qt[index];
    let qContainer = document.querySelector(".question");

    let answersHtml = "";
    cq.answers.forEach((ans, i) => {
        const isChecked = userAnswers[index].includes(i) ? "checked" : "";

        answersHtml += `
            <div class="answer-item">
                <label>
                    <input type="checkbox" class="ans-check" ${isChecked} 
                           onchange="handleAnswerClick(this, ${index}, ${i})"> 
                    ${ans.text}
                </label>
            </div>
        `;
    });

    qContainer.innerHTML = `
        <div class="question-header">
            <h2>Câu hỏi ${index + 1} trên ${qt.length}:</h2>
            <p class="question-text">${cq.name}</p>
        </div>
        <div class="answer-list">
            ${answersHtml}
        </div>
    `;
}
function handleAnswerClick(input, qIndex, aIndex) {
    if (input.checked) {
        if (!userAnswers[qIndex].includes(aIndex)) {
            userAnswers[qIndex].push(aIndex);
        }
    } else {
        userAnswers[qIndex] = userAnswers[qIndex].filter(item => item !== aIndex);
    }

    const navBtn = document.getElementById(`nav-btn-${qIndex}`);
    if (userAnswers[qIndex].length > 0) {
        navBtn.classList.add("answered");
    } else {
        navBtn.classList.remove("answered");
    }
}
function nextClick() {
    if (currentIndex < qt.length - 1) {
        currentIndex++;
        updateUI();
    }
}

function prevClick() {
    if (currentIndex > 0) {
        currentIndex--;
        updateUI();
    }
}

function jumpToQuestion(index) {
    currentIndex = index;
    updateUI();
}
function updateUI() {
    showQuestion(currentIndex);
    updateNavStatus();
    checkButtonStatus();
}

function updateNavStatus() {
    const navButtons = document.querySelectorAll(".groupOfQuestion button");
    navButtons.forEach((btn, index) => {
        btn.classList.remove("current");
        if (index === currentIndex) {
            btn.classList.add("current");
        }
    });
}

function checkButtonStatus() {
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (!prevBtn || !nextBtn) return;

    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === qt.length - 1);
    prevBtn.style.opacity = prevBtn.disabled ? "0.2" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.2" : "1";
    prevBtn.style.pointerEvents = prevBtn.disabled ? "none" : "auto";
    nextBtn.style.pointerEvents = nextBtn.disabled ? "none" : "auto";
    prevBtn.style.cursor = prevBtn.disabled ? "default" : "pointer";
    nextBtn.style.cursor = nextBtn.disabled ? "default" : "pointer";
}

function startTimer() {
    if (!quizData || !quizData.time) return;
    let minutes = parseInt(quizData.time);
    totalSeconds = minutes * 60;

    let timerInterval = setInterval(function () {
        let min = Math.floor(totalSeconds / 60);
        let sec = totalSeconds % 60;
        let displayMin = min < 10 ? "0" + min : min;
        let displaySec = sec < 10 ? "0" + sec : sec;

        document.querySelector(".countDown").innerHTML = `
            <p>Thời gian: ${minutes} phút</p>
            <p style="color: red; font-weight: bold;">Còn lại: ${displayMin}:${displaySec}</p>
        `;

        if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        Swal.fire({
            title: "Hết giờ!",
            text: "Hệ thống sẽ tự động nộp bài.",
            icon: "info",
            timer: 3000,
            showConfirmButton: false
        }).then(() => {
            showSummaryPopup();
        });
    } else {
            totalSeconds--;
        }
    }, 1000);
}
startTimer();
function renderName() {
    if (quizData && quizData.name) {
        const titleElement = document.querySelector(".hr h2");
        if (titleElement) {
            titleElement.innerText = quizData.name;
        }
    }
    
}

function calculateResults() {
    let correctCount = 0;
    let totalQuestions = qt.length;
    qt.forEach((question, qIndex) => {
        let userSelected = userAnswers[qIndex];
        let correctIndexes = [];
        question.answers.forEach((ans, aIndex) => {
            if (ans.correct === true || ans.correct === "true") {
                correctIndexes.push(aIndex);
            }
        });
        if (userSelected.length > 0 &&
            userSelected.length === correctIndexes.length &&
            userSelected.every(val => correctIndexes.includes(val))) {
            correctCount++;
        }
    });

    let wrongCount = totalQuestions - correctCount;
    let scorePercent = Math.round((correctCount / totalQuestions) * 100);

    return {
        total: totalQuestions,
        correct: correctCount,
        wrong: wrongCount,
        percent: scorePercent
    };
}

function checkBtn() {
    let unanswered = userAnswers.filter(ans => ans.length === 0).length;

    if (unanswered > 0) {
        Swal.fire({
            title: 'Chưa hoàn thành?',
            text: `Bạn còn ${unanswered} câu chưa trả lời. Bạn vẫn muốn nộp bài chứ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Nộp luôn',
            cancelButtonText: 'Làm tiếp'
        }).then((result) => {
            if (result.isConfirmed) showSummaryPopup();
        });
    } else {
        showSummaryPopup();
    }
}

function showSummaryPopup() {
    const res = calculateResults();

    Swal.fire({
        title: 'Hoàn thành',
        html: `
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2e7d32; margin-bottom: 10px;">Chúc mừng!</h3>
                <p>Bạn đã hoàn thành bài kiểm tra</p>
                <hr style="border: 0.5px solid #c8e6c9; margin: 15px 0;">
                <h2 style="color: #2e7d32;">Điểm của bạn: ${res.percent}%</h2>
            </div>
            <div style="text-align: left; border: 1px solid #eee; border-radius: 8px; padding: 15px;">
                <p style="text-align: center; font-weight: bold; margin-bottom: 15px;">Kết quả cụ thể</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Tổng số câu hỏi:</span> <b>${res.total}</b>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Câu trả lời đúng:</span> <b style="color: #2e7d32;">${res.correct}</b>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Câu trả lời sai:</span> <b style="color: #d32f2f;">${res.wrong}</b>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Trang chủ',
        confirmButtonColor: '#198754',
        showDenyButton: true,
        denyButtonText: 'Làm lại',
        denyButtonColor: '#0d6efd',
        allowOutsideClick: false,
        width: '500px'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./mainPages.html";
        } else if (result.isDenied) {
            location.reload();
        }
    });
}

if (qt.length > 0) {
    renderName();
    renderNav();
    updateUI();
} else {
    document.querySelector(".question").innerHTML = "Không có dữ liệu câu hỏi.";
}