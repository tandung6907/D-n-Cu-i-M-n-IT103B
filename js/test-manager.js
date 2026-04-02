// 1. Khai báo các phần tử DOM
const tableBody = document.querySelector(".responsive-table tbody");
const deleteModal = document.getElementById("deleteModal");
const deleteIdInput = document.getElementById("deleteId");

// 2. Quản lý localStorage (Dữ liệu bài test)
let tests = JSON.parse(localStorage.getItem("tests")) || [
  {
    id: 1,
    name: "History Quiz",
    category: "📚 Lịch sử",
    questions: 15,
    time: "10 min",
  },
  {
    id: 2,
    name: "Science Challenge",
    category: "🧠 Khoa học",
    questions: 20,
    time: "15 min",
  },
  {
    id: 3,
    name: "Entertainment Trivia",
    category: "🎤 Đời sống",
    questions: 10,
    time: "5 min",
  },
];

const syncStorage = () => {
  localStorage.setItem("tests", JSON.stringify(tests));
};

// 3. Hàm ẩn/hiện Modal
const toggleModal = (modalElement, show) => {
  if (modalElement) {
    modalElement.style.display = show ? "flex" : "none";
  }
};

// 4. Render bảng bài test
const renderTable = () => {
  tableBody.innerHTML = "";

  tests.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="text-center" data-label="ID">${item.id}</td>
            <td data-label="Tên bài test">${item.name}</td>
            <td data-label="Danh mục">${item.category}</td>
            <td data-label="Số câu hỏi">${item.questions}</td>
            <td data-label="Thời gian">${item.time}</td>
            <td class="text-center" data-label="Hành động">
                <div class="action-group">
                    <a href="./edit-test.html" class="btn btn-edit" style="text-decoration: none;">Sửa</a>
                    <button class="btn btn-delete" onclick="prepareDelete(${item.id})">Xoá</button>
                </div>
            </td>
        `;
    tableBody.appendChild(tr);
  });
};

// 5. Logic Xoá

// Mở modal xác nhận xoá
window.prepareDelete = (id) => {
  deleteIdInput.value = id;
  toggleModal(deleteModal, true);
};

// Thực hiện xoá khi nhấn nút Xoá trên popup đỏ
const confirmDelete = () => {
  const idToDelete = parseInt(deleteIdInput.value);

  // Lọc bỏ phần tử bị xoá
  tests = tests.filter((t) => t.id !== idToDelete);

  syncStorage();
  renderTable();
  toggleModal(deleteModal, false);
};


// Kiểm tra đăng nhập admin
function checkLogin() {
  let currentUserStr = localStorage.getItem("currentUser");
  if (!currentUserStr) {
    window.location.href = "../pages/login.html";
    return;
  }
  let currentUser;
  try {
    currentUser = JSON.parse(currentUserStr);
  } catch (e) {
    localStorage.removeItem("currentUser");
    window.location.href = "../pages/login.html";
    return;
  }
  
  if (currentUser.role !== "admin") {
    window.location.href = "../pages/home.html";
    return;
  }
}

// 6. Gán sự kiện cho các nút bấm in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  checkLogin();

  // Nút Xoá trong modal
  const btnConfirmDelete = document.querySelector("#deleteModal .btn-danger");
  if (btnConfirmDelete) {
    btnConfirmDelete.onclick = () => confirmDelete();
  }

  // Nút Đóng/Huỷ modal
  const closeBtns = document.querySelectorAll(".close-btn, .btn-secondary");
  closeBtns.forEach((btn) => {
    btn.onclick = () => {
      toggleModal(deleteModal, false);
    };
  });

  // Khởi tạo bảng lần đầu
  renderTable();
});
