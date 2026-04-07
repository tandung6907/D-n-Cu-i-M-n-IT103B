let somesome = JSON.parse(localStorage.getItem("anc"));

function errors(lass,announcement,value){
    document.querySelector(lass).style.display = value;
    document.querySelector(lass).textContent = announcement;
}

let accounts = somesome ? somesome : [
    { id: 1, category: "📚 Lịch sử" },
    { id: 2, category: "🧠 Khoa học" },
    { id: 3, category: "🎤 Giải trí" },
    { id: 4, category: "🏠 Đời sống" },
    { id: 5, category: "⌛ Đia lý" },
    { id: 6, category: "🔩 Vật lý" },
    { id: 7, category: "🎲 Toán học" },
    { id: 8, category: "💩 Sinh học" },
    { id: 9, category: "🥠 Văn học" },
    { id: 10, category: "🌌 Hóa học" },
    { id: 11, category: "🌊 Thể dục" },
    { id: 12, category: "🪂 Tin học" },
];
let currentPage = 1;
let limit = 5;
let editId = null;
let idToDelete = null;

function showUp() {
    let start = (currentPage - 1) * limit;
    let end = start + limit;
    let paginatedItems = accounts.slice(start, end);
    let str = "";
    
    for (let i = 0; i < paginatedItems.length; i++) {
        let displayIndex = start + i + 1; 
        
        str += `
            <tr class = "${i % 2 === 0 ? 'odd' : ''}">
                <td class="num">${displayIndex}</td>
                <td>${paginatedItems[i].category}</td>
                <td class="grBtn">
                    <button id="updBtn" onclick = "clickUpd(${paginatedItems[i].id})">Sửa</button>
                    <button id="delBtn" onclick = "clickDel(${paginatedItems[i].id})">Xoá</button>
                </td>
            </tr>
        `;
    }
    document.getElementById("tbdy").innerHTML = str;
    localStorage.setItem("anc", JSON.stringify(accounts));
    renderPagination();
}
showUp();

let modal = document.getElementById("categoryModal");
function clickAdd() {
    editId = null;
    document.querySelector(".modal-header h3").innerText = "Thêm danh mục";
    
    const nameInput = document.getElementById("categoryName");
    const emojiInput = document.getElementById("categoryEmoji");

    nameInput.value = "";
    emojiInput.value = "";
    
    document.getElementById("error-msg").style.display = "none";
    document.getElementById("empty-msg").style.display = "none";
    document.getElementById("categoryModal").style.display = "flex";
}

function clickUpd(index) {
    editId = index;
    document.querySelector(".modal-header h3").innerText = "Sửa danh mục";

    let item = accounts.find(value => value.id === index);
    if (item) {
        let parts = item.category.split(" ");
        document.getElementById("categoryEmoji").value = parts[0];
        document.getElementById("categoryName").value = parts.slice(1).join(" ");
    }

    document.getElementById("categoryModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("categoryModal").style.display = "none";
}

function saveCategory() {
    const name = document.getElementById("categoryName").value.trim();
    const emoji = document.getElementById("categoryEmoji").value.trim();
    const errorMsg = document.getElementById("error-msg");
    const emptyMsg = document.getElementById("empty-msg");

    errorMsg.style.display = "none";
    emptyMsg.style.display = "none";

    if (!name || !emoji) {
        emptyMsg.innerText = "Vui lòng điền đầy đủ thông tin!";
        emptyMsg.style.display = "block";
        return;
    }
    if (name.length > 20) {
        emptyMsg.innerText = "Tên danh mục không quá 20 ký tự!";
        emptyMsg.style.display = "block";
        return;
    }

    const emojiArray = Array.from(emoji);
    if (emojiArray.length !== 1) {
        emptyMsg.innerText = "Chỉ được chọn duy nhất 1 emoji!";
        emptyMsg.style.display = "block";
        return;
    }

    const isExist = accounts.find(a => {
        let categoryNameOnly = a.category.split(" ").slice(1).join(" ");
        return categoryNameOnly.toLowerCase() === name.toLowerCase() && a.id !== editId;
    });

    if (isExist) {
        errorMsg.style.display = "block";
        return;
    }

    if (editId === null) {
        const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
        accounts.push({ id: newId, category: `${emoji} ${name}` });
    } else {
        let index = accounts.findIndex(a => a.id === editId);
        if (index !== -1) {
            accounts[index].category = `${emoji} ${name}`;
        }
    }
    showUp();
    closeModal();
}

function clickDel(index) {
    idToDelete = index;
    let item = accounts.find(value => value.id === index);

    if (item) {
        let categoryNameOnly = item.category.split(" ").slice(1).join(" ");
        document.querySelector("#deleteModal .modal-body p").innerHTML =
            `Bạn chắc chắn muốn xoá category <strong>"${categoryNameOnly}"</strong>?`;
    }
    document.getElementById("deleteModal").style.display = "flex";

}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
    document.getElementById("error-msg").style.display = "none";
    document.getElementById("empty-msg").style.display = "none";
}

function confirmDelete() {
    if (idToDelete !== null) {
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id == idToDelete) {
                accounts.splice(i, 1);
                break;
            }
        }
        showUp();
        closeDeleteModal();
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

function renderPagination() {
    const totalPages = Math.ceil(accounts.length / limit);
    let paginationHTML = "";

    paginationHTML += `
        <button class="special ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})">&lt;</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="${i === currentPage ? 'current' : 'other'}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }

    paginationHTML += `
        <button class="other next ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})">&gt;</button>
    `;

    document.querySelector(".pages").innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(accounts.length / limit);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    showUp();
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