// file này xử lí login cho danh mục Ứng viên

// tạo key để lưu trong localStorage
const STORAGE_KEY = "candidates_data";

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

// hàm hiển thị danh sách ứng viên
function displayCandidates() {
  // lấy dữ liệu từ STORAGE
  const candidates = getCandidatesFromStorage();
  renderCandidates(candidates);
}

// hàm tìm kiếm ứng viên theo tên, sđt, email => output: list ứng viên
function searchCandidates(keyword) {
  // lấy toàn bộ data - search trên data đó
  const allCandidates = getCandidatesFromStorage();

  // chuẩn hóa keyword
  const trimed = keyword.trim().toLowerCase();

  if (!trimed) {
    renderCandidates(allCandidates);
    return;
  }

  const filteredCandidates = allCandidates.filter((emp) => { // hàm này trả về list ứng viên thoả mãn
    // kiểm tra nếu có name, email, sđt trùng với keyword thì emp đó ok 

    // kiểm tra name có trùng k 
    const name = emp.fullName && emp.fullName.toLowerCase().includes(trimed); // hàm trả về true nếu trùng tên
    const phone = emp.phone && emp.phone.toLowerCase().includes(trimed); // hàm trả về true nếu trùng sđt
    const email = emp.email && emp.email.toLowerCase().includes(trimed); // hàm trả về true nếu trùng email

    return name || phone || email; // chỉ cần trùng 1 trong 3

  });

  renderCandidates(filteredCandidates)
}

// chỉ chạy hàm xử lí sự kiện khi loaded xong UI
document.addEventListener("DOMContentLoaded", () => {
  // lưu dữ liệu mặc định vào Storage
  saveDefaultDataToLocalStorage();

  // hiển thị dữ liệu từ Storage
  displayCandidates();

  // bắt sự kiện khi click input-search
  const searchInput = document.getElementById("input-search");
  searchInput.addEventListener("input", function () {
    searchCandidates(this.value);
  });
});
