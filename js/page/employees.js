// file này xử lí login cho danh mục Ứng viên

// import file xử lí show/ hidden Model thêm ứng viên
// import { initAddCandidateModal } from "./modelAddCandidates";

// tạo key để lưu trong localStorage
const STORAGE_KEY = "candidates_data";

//xử lí show/ hidden Model thêm ứng viên
// show/ hidden Model thêm ứng viên
const addCandidates = document.querySelector(".add-candidates");
const form = document.getElementById("form__add");

const cancleFormAdd = document.querySelector(".form__footer__btn--cancel");

addCandidates.addEventListener("click", () => {
  form.classList.toggle("display-block");
});
cancleFormAdd.addEventListener("click", () => {
  form.classList.toggle("display-block");
});

// phân trang
let _currentPage = 1;
let _pageSize = 15;
let _currentCandidates = [];

// hàm lưu dữ liệu default trong localStorage
function saveDefaultDataToLocalStorage() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  // kiểm tra có data trong file data chưa + chỉ lưu khi Storage chưa có data
  if (!storedData && typeof employees !== "undefined" && employees.length > 0) {
    // nếu có thì lưu vào Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)); // cần chuyển sang string để lưu trong storage
    console.log("Đã lưu dữ liệu ứng viên vào localStorage");
  }
}

// hàm get data từ local Storage
function getCandidatesFromStorage() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
}

// hàm render danh sách ứng viên theo mảng truyền vào
function renderCandidates(candidates) {
  // kiểm tra xem có data không
  if (!candidates || !candidates.length) return;

  // nếu có, tiến hành:
  const tbody = document.querySelector(".candidate-table tbody");
  // console.log(tbody)

  tbody.innerHTML = "";

  candidates.forEach((employee) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td class="checkbox"><input type="checkbox"></td>
            <td>
                <div class="avatar-cell">
                <img class="avatar"
                    src="https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&width=64&height=64"
                    alt="${employee.fullName || "--"}"> ${employee.fullName || "--"}</div>
           </td>
            <td>${employee.phoneNumber || "--"}</td>
            <td>${employee.candidateSource || "--"}</td>
            <td title="${employee.email || "--"}">${employee.email || "--"}</td>
            <td>${employee.recruitmentCampaign || "--"}</td>
            <td>${employee.position || "--"}</td>
            <td>${employee.jobPosting || "--"}</td>
            <td>${employee.recruitmentStage || "--"}</td>
            <td>${employee.evaluation || "--"}</td>
            <td>${employee.country || "--"}</td>
            <td>${employee.province || "--"}</td>
            <td>${employee.ward || "--"}</td>
        `;
    // thêm row vào tbody
    tbody.appendChild(row);
  });
}

// hàm hiển render theo page - theo _currentCandidates
function renderPage() {
  const start = (_currentPage - 1) * _pageSize;
  const end = start + _pageSize;

  const pageData = _currentCandidates.slice(start, end);
  renderCandidates(pageData);

  pageInfor();
}

// hàm hiển thị danh sách ứng viên
function displayCandidates() {
  // lấy dữ liệu từ STORAGE
  const candidates = getCandidatesFromStorage();
  _currentCandidates = candidates;
  renderPage();
}

// hàm tìm kiếm ứng viên theo tên, sđt, email => output: list ứng viên
function searchCandidates(keyword) {
  const allCandidates = getCandidatesFromStorage();
  // chuẩn hóa keyword
  const trimed = keyword.trim().toLowerCase();

  if (!trimed) {
    renderCandidates(allCandidates);
    return;
  }

  // khi đã có keyword
  const filteredCandidates = allCandidates.filter((emp) => {
    // kiểm tra nếu có name, email, sđt trùng với keyword thì emp đó trả về true
    if (emp.fullName && emp.fullName.toLowerCase().includes(trimed))
      return true;
    if (emp.phoneNumber && emp.phoneNumber.toLowerCase().includes(trimed))
      return true;
    if (emp.email && emp.email.toLowerCase().includes(trimed)) return true;

    return false;
  });

  // khi search xong cần reset lại _currentPage = 1
  _currentPage = 1;
  _currentCandidates = filteredCandidates;

  renderPage();
}

// hàm hiển thị thông tin page - footer
function pageInfor() {
  // lấy tổng số bản ghi
  const total = _currentCandidates.length;
  document.querySelector(".total-record").textContent =
    `Tổng bản ghi: ${total}`;

  // lấy index bản ghi
  let start = (_currentPage - 1) * _pageSize + 1;

  let end = start + _pageSize - 1;
  if(total < end) end = total;

  let indexRecord = document.querySelector(".index-record");
  indexRecord.textContent = `
    ${start} - ${end} bản ghi
  `;
}

// chỉ chạy hàm xử lí sự kiện khi loaded xong UI
document.addEventListener("DOMContentLoaded", () => {});

function initEventData() {
  // lưu dữ liệu mặc định vào Storage
  saveDefaultDataToLocalStorage();

  // hiển thị dữ liệu từ Storage
  displayCandidates();

  const inputSearch = document.getElementById("input-search");
  inputSearch.addEventListener("input", (e) => {
    searchCandidates(e.target.value);
  });

  let pageSize = document.getElementById("select_page_size");
  pageSize.addEventListener("change", () => {
    _pageSize = Number(pageSize.value);
    renderPage();
  });

}


  // hàm xử lí tiến, lùi trang
  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  // tiến trang
  next.addEventListener("click", () => {
    const total = _currentCandidates.length;
    if(_currentPage * _pageSize > total) {
      let next = document.querySelector(".next");
      next.disabled = true;
    return
    }
    _currentPage = Number(_currentPage + 1);
    console.log(_currentPage);
    renderPage();
  });

  // lùi trang
  prev.addEventListener("click", () => {
    if(_currentPage == 1) {
      let prev = document.querySelector(".prev");
      prev.disabled = true;
      return
    }

    _currentPage = Number(_currentPage - 1);

    console.log(_currentPage);
    renderPage();
  });

window.initEventData = initEventData;
