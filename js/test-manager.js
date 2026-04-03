const ITEMS_PER_PAGE = 5;
const TEST_KEY = "tests";

let tests = [];
let currentPage = 1;
let pendingDeleteId = null;
let filtered = [];

const tbody = document.getElementById("table-body");
const pagination = document.getElementById("pagination");
const overlay = document.getElementById("overlay");
const confirmName = document.getElementById("confirm-name");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// LOAD
function loadTestFromLocalStorage() {
  const data = localStorage.getItem(TEST_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTestToLocalStorage() {
  localStorage.setItem(TEST_KEY, JSON.stringify(tests));
}

// FILTER AND SORT
function getFiltered() {
  const query = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;
  let result = tests.filter((t) => t.name.toLowerCase().includes(query));
  if (sort === "asc") result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  if (sort === "desc")
    result.sort((a, b) => b.name.localeCompare(a.name, "vi"));
  return result;
}

// RENDER BẢNG
// ... (Các phần filter/sort giữ nguyên)

function renderTable() {
  filtered = getFiltered();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Không tìm thấy bài test nào...</td></tr>`;
  } else {
    tbody.innerHTML = pageItems
      .map((t) => {
        // Xử lý hiển thị ảnh hoặc SVG mặc định
        const imgDisplay = t.img
          ? `<img src="${t.img}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:8px;" />`
          : `<svg class="category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#555" width="20" height="20" style="margin-right:8px;">
                         <path d="M96 0C43 0 0 43 0 96v320c0 53 43 96 96 96h256c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32s14.3-32 32-32h288c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H96zm32 128h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H128c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H128c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                       </svg>`;

        return `
                <tr>
                    <td class="col-id">${t.id}</td>
                    <td class="col-name">
                        <div class="category-name">
                            <span>${t.name}</span>
                        </div>
                    </td>
                    <td class="col-category">
                    <div style="display:flex; align-items: center;">
                      ${imgDisplay}
                      ${t.category || "—"}
                    </div>
                    </td>
                    <td class="col-question">${t.questions ? t.questions.length : 0} câu</td>
                    <td class="col-time">${t.time} phút</td>
                    <td>
                        <div class="action-cell">
                            <a class="btn-edit" href="../pages/test-edit.html?id=${t.id}">Sửa</a>
                            <button class="btn-delete" onclick="handleDeleteClick(${t.id}, '${t.name.replace(/'/g, "\\'")}')">Xoá</button>
                        </div>
                    </td>
                </tr>`;
      })
      .join("");
  }
  renderPagination(totalPages);
}

// PHÂN TRANG
function renderPagination(totalPages) {
  let html = `<button class="page-arrow" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>&#8249;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? "active" : ""}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="page-arrow" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>&#8250;</button>`;
  pagination.innerHTML = html;
}

function goPage(page) {
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}

// XÓA
function handleDeleteClick(id, name) {
  pendingDeleteId = id;
  confirmName.textContent = name;
  overlay.classList.add("active");
}

document.getElementById("btn-cancel").addEventListener("click", () => {
  overlay.classList.remove("active");
  pendingDeleteId = null;
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
    pendingDeleteId = null;
  }
});

document.getElementById("btn-confirm-delete").addEventListener("click", () => {
  if (pendingDeleteId !== null) {
    tests = tests.filter((t) => t.id !== pendingDeleteId);
    saveTestToLocalStorage();
    pendingDeleteId = null;
    overlay.classList.remove("active");
    renderTable();
  }
});

// SEARCH AND SORT
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});
sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

// LẮNG NGHE SỰ KIỆN LƯU THÊM TỪ TEST ADD
window.addEventListener("storage", (e) => {
  if (e.key === TEST_KEY) {
    tests = loadTestFromLocalStorage();
    renderTable();
  }
});

tests = loadTestFromLocalStorage();
renderTable();
