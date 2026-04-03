//1. Khai báo các phần tử DOM
const tableBody = document.getElementById("categoryTableBody");
// Các phần tử của Modal Thêm/Sửa
const modal = document.getElementById("categoryModal");
const modalTitle = document.getElementById("modalTitle");
const inputName = document.getElementById("categoryName");
const inputEmoji = document.getElementById("categoryEmoji");
const inputId = document.getElementById("editCategoryId");
const errorMsg = document.getElementById("error-msg");

// Các phần tử của Modal Xoá
const deleteModal = document.getElementById("deleteModal");
const deleteIdInput = document.getElementById("deleteId");

// Nút bấm chính
const btnAdd = document.querySelector(".btn-add");

//2. Quản lý localStorage
// Lấy dữ liệu từ máy người dùng, nếu chưa có thì tạo mảng mặc định
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Lịch sử", emoji: "📚" },
  { id: 2, name: "Khoa học", emoji: "🧠" },
  { id: 3, name: "Giải trí", emoji: "🎤" },
  { id: 4, name: "Đời sống", emoji: "🏠" },
];

// Hàm lưu dữ liệu vào Local Storage
const syncStorage = () => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

//3. Các hàm tiện ích
// Hàm ẩn/hiện Modal bất kỳ
const toggleModal = (modalElement, show) => {
  modalElement.style.display = show ? "flex" : "none";
};

// Hàm xoá báo lỗi đỏ trên input
const resetError = () => {
  inputName.classList.remove("input-error");
  inputEmoji.classList.remove("input-error");
  errorMsg.textContent = "";
  errorMsg.style.display = "none";
};

//4. Render bảng
const renderTable = () => {
  tableBody.innerHTML = ""; // Xoá sạch bảng trước khi vẽ

  categories.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="text-center">${item.id}</td>
            <td>${item.emoji} ${item.name}</td>
            <td>
                <div class="action-group">
                    <button class="btn btn-edit" onclick="prepareEdit(${item.id})">Sửa</button>
                    <button class="btn btn-delete" onclick="prepareDelete(${item.id})">Xoá</button>
                </div>
            </td>
        `;
    tableBody.appendChild(tr);
  });
};

//5. Logic thêm và sửa

// Mở modal để THÊM MỚI
btnAdd.onclick = () => {
  modalTitle.innerText = "Thêm danh mục";
  inputId.value = ""; // ID rỗng để đánh dấu là thêm mới
  inputName.value = "";
  inputEmoji.value = "";
  resetError();
  toggleModal(modal, true);
};

// Mở modal để sửa
window.prepareEdit = (id) => {
  const item = categories.find((c) => c.id === id);
  if (item) {
    modalTitle.innerText = "Sửa danh mục";
    inputId.value = item.id;
    inputName.value = item.name;
    inputEmoji.value = item.emoji;
    resetError();
    toggleModal(modal, true);
  }
};

// Hàm xử lý khi nhấn nút lưu trên popup
const saveData = () => {
  const nameVal = inputName.value.trim();
  const emojiVal = inputEmoji.value.trim();
  const currentId = inputId.value;

  let errors = [];
  if (!nameVal) {
    errors.push("Tên danh mục không được trống");
  } else if (nameVal.length < 3 || nameVal.length > 50) {
    errors.push("Tên danh mục phải từ 3 đến 50 ký tự");
  }

  if (!emojiVal) {
    errors.push("Emoji không được trống");
  } else if (emojiVal.length < 1 || emojiVal.length > 3) {
    errors.push("Emoji phải từ 1 đến 3 ký tự");
  }

  // Validate: Kiểm tra trùng tên (Bỏ qua chính nó nếu đang sửa)
  const isDuplicate = categories.some(
    (c) => c.name.toLowerCase() === nameVal.toLowerCase() && c.id != currentId,
  );

  if (isDuplicate) {
    errors.push("Tên danh mục đã tồn tại");
  }

  if (errors.length > 0) {
    const errorText = errors.join(", ");
    errorMsg.textContent = errorText;
    errorMsg.style.display = "block";
    inputName.classList.add("input-error");
    inputEmoji.classList.add("input-error");
    return;
  }

  // Clear lỗi trước khi lưu
  resetError();

  if (currentId === "") {
    // Logic thêm: Tạo ID mới tự động tăng
    const newId =
      categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    categories.push({ id: newId, name: nameVal, emoji: emojiVal });
  } else {
    // Logic sửa: Tìm và cập nhật mục cũ
    const index = categories.findIndex((c) => c.id == currentId);
    categories[index] = {
      ...categories[index],
      name: nameVal,
      emoji: emojiVal,
    };
  }

  syncStorage(); // Lưu lại
  renderTable(); // Vẽ lại bảng
  toggleModal(modal, false); // Đóng popup
};

//6. Logic xoá

// Mở modal xác nhận xoá
window.prepareDelete = (id) => {
  deleteIdInput.value = id;
  toggleModal(deleteModal, true);
};

// Thực hiện xoá khi nhấn nút Xoá trên popup đỏ
const confirmDelete = () => {
  const idToDelete = parseInt(deleteIdInput.value);

  // Lọc bỏ phần tử bị xoá
  categories = categories.filter((c) => c.id !== idToDelete);

  syncStorage();
  renderTable();
  toggleModal(deleteModal, false);
};

// Kiểm tra đăng nhập admin
const checkLogin = () => {
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
};

// Chạy khi trang load
window.onload = function () {
  checkLogin();

  // Gán sự kiện nút lưu
  document.getElementById("btnSave").onclick = function () {
    saveData();
  };

  // Nút xác nhận xóa
  let btnDel = document.querySelector("#deleteModal .btn-danger");
  if (btnDel) {
    btnDel.onclick = function () {
      confirmDelete();
    };
  }

  // Nút đóng modal
  let closeBtns = document.querySelectorAll(".close-btn, .btn-secondary");
  for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].onclick = function () {
      toggleModal(modal, false);
      toggleModal(deleteModal, false);
    };
  }

  // Xóa lỗi khi nhập
  inputName.oninput = function () {
    resetError();
  };

  inputEmoji.oninput = function () {
    resetError();
  };

  renderTable();
};
