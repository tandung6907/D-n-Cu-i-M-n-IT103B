
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/pages/login.html";
}

function logout() {
    localStorage.removeItem("currentUser");
}


function showError(selector, message, visible) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = message;
    el.style.display = visible ? "block" : "none";
}


let categories = JSON.parse(localStorage.getItem("categories"));
if (!categories) {
    categories = [
        { id: 1, categoryName: "Lịch sử", categoryEmoji: "📚" },
        { id: 2, categoryName: "Khoa học", categoryEmoji: "🧠" },
        { id: 3, categoryName: "Giải trí", categoryEmoji: "🎤" },
        { id: 4, categoryName: "Đời sống", categoryEmoji: "🏠" },
        { id: 5, categoryName: "Địa lý", categoryEmoji: "🌍" },
        { id: 6, categoryName: "Toán học", categoryEmoji: "🔢" },
        { id: 7, categoryName: "Tiếng Anh", categoryEmoji: "🇬🇧" },
        { id: 8, categoryName: "Y tế", categoryEmoji: "⚕️" },
        { id: 9, categoryName: "Thể thao", categoryEmoji: "⚽" },
        { id: 10, categoryName: "Công nghệ", categoryEmoji: "💻" }
    ];
    localStorage.setItem("categories", JSON.stringify(categories));
}


let editingId = null;
let deleteId = null;
let currentPage = 1;
const limit = 5;

const tableBody = document.getElementById("categoryTableBody");
const btnAdd = document.getElementById("btnAddCategory");
const editModal = document.getElementById("categoryEditModal");
const deleteModal = document.getElementById("categoryDeleteModal");
const inputName = document.getElementById("category-name");
const inputEmoji = document.getElementById("emoji");


function renderTable() {
    const start = (currentPage - 1) * limit;
    const pageData = categories.slice(start, start + limit);

    tableBody.innerHTML = pageData.map(cat => `
        <tr>
            <td>${cat.id}</td>
            <td>${cat.categoryEmoji} ${cat.categoryName}</td>
            <td class="action-cell">
                <button class="btn-edit" onclick="openEditModal(${cat.id})">Sửa</button>
                <button class="btn-delete" onclick="openDeleteModal(${cat.id})">Xoá</button>
            </td>
        </tr>
    `).join('');

    renderPagination();
}


function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(categories.length / limit));
    let html = `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
    document.querySelector('.pagination').innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.max(1, Math.ceil(categories.length / limit));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}


function openAddModal() {
    editingId = null;
    editModal.querySelector("h2").innerText = "Thêm danh mục mới";
    inputName.value = "";
    inputEmoji.value = "";
    showError(".error-text", "", false);
    editModal.classList.add("active");
}

function openEditModal(categoryId) {
    editingId = categoryId;
    editModal.querySelector("h2").innerText = "Chỉnh sửa danh mục";

    const foundCat = categories.find(cat => cat.id === categoryId);
    inputName.value = foundCat.categoryName;
    inputEmoji.value = foundCat.categoryEmoji;

    showError(".error-text", "", false);
    editModal.classList.add("active");
}

function closeEditModal() {
    editModal.classList.remove("active");
}


function validateForm() {
    const name = inputName.value.trim();
    const emoji = inputEmoji.value.trim();

    showError(".error-text", "", false);
    inputName.classList.remove("input-error");

    if (!name) {
        showError(".error-text", "Tên danh mục không được để trống", true);
        inputName.classList.add("input-error");
        return false;
    }

    if (name.length < 2 || name.length > 30) {
        showError(".error-text", "Tên danh mục phải từ 2 đến 30 ký tự", true);
        inputName.classList.add("input-error");
        return false;
    }

    if (!emoji) {
        showError(".error-text", "Bạn chưa nhập emoji", true);
        return false;
    }

    const isDuplicate = categories.some(cat => {
        if (editingId && cat.id === editingId) return false;
        return cat.categoryName.toLowerCase() === name.toLowerCase();
    });

    if (isDuplicate) {
        showError(".error-text", "Tên danh mục đã tồn tại", true);
        inputName.classList.add("input-error");
        return false;
    }

    return true;
}


function saveCategory() {
    if (!validateForm()) return;

    const name = inputName.value.trim();
    const emoji = inputEmoji.value.trim();

    if (!editingId) {
        const maxId = categories.length === 0 ? 0 : Math.max(...categories.map(c => c.id));
        categories.push({
            id: maxId + 1,
            categoryName: name,
            categoryEmoji: emoji
        });
        currentPage = Math.ceil(categories.length / limit);
    } else {
        const index = categories.findIndex(cat => cat.id === editingId);
        categories[index].categoryName = name;
        categories[index].categoryEmoji = emoji;
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    closeEditModal();
    renderTable();
}


function openDeleteModal(categoryId) {
    deleteId = categoryId;
    deleteModal.classList.add("active");
}

function closeDeleteModal() {
    deleteModal.classList.remove("active");
}

function confirmDeleteCategory() {
    categories = categories.filter(cat => cat.id !== deleteId);
    const totalPages = Math.max(1, Math.ceil(categories.length / limit));
    if (currentPage > totalPages) currentPage = totalPages;

    localStorage.setItem("categories", JSON.stringify(categories));
    closeDeleteModal();
    renderTable();
}


btnAdd.addEventListener("click", openAddModal);

editModal.querySelector(".close-btn").addEventListener("click", closeEditModal);
editModal.querySelector(".btn-cancel").addEventListener("click", closeEditModal);
editModal.querySelector(".btn-save").addEventListener("click", saveCategory);

deleteModal.querySelector(".close-btn").addEventListener("click", closeDeleteModal);
deleteModal.querySelector(".btn-cancel").addEventListener("click", closeDeleteModal);
deleteModal.querySelector(".btn-delete").addEventListener("click", confirmDeleteCategory);

window.addEventListener("click", e => {
    if (e.target === editModal) closeEditModal();
    if (e.target === deleteModal) closeDeleteModal();
});


renderTable();