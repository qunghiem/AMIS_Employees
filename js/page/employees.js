// Xử lý logic trang Ứng viên

// hàm render trang hiện tại
function renderPage() {
  const pageData = getPageData();
  renderCandidates(pageData);
  renderPageInfo();
}
// hàm hiển thị toàn bộ danh sách
function displayCandidates() {
  const candidates = getAllCandidates();
  setCurrentCandidates(candidates);
  resetPage(); // reset current page về 1
  renderPage();
}
// hàm tìm kiếm theo tên, sđt, email
function searchCandidates(keyword) {
  const all = getAllCandidates();

  // chuẩn hóa keyword nhập liệu 
  const trimmed = keyword.trim().toLowerCase();
  
  if (!trimmed) {
    setCurrentCandidates(all);
  } else {
    const filtered = all.filter((emp) => {
      if (emp.fullName && emp.fullName.toLowerCase().includes(trimmed)) return true;
      if (emp.phoneNumber && emp.phoneNumber.toLowerCase().includes(trimmed)) return true;
      if (emp.email && emp.email.toLowerCase().includes(trimmed)) return true;
      return false;
    });
    setCurrentCandidates(filtered);
  }

  resetPage();
  renderPage();
}
// Khởi tạo sự kiện
function initCandidatePage() {
  saveDefaultDataToStorage();
  displayCandidates();

  // Tìm kiếm
  document.getElementById("input-search").addEventListener("input", function () {
    searchCandidates(this.value);
  });

  // Thay đổi số bản ghi/trang
  document.getElementById("select_page_size").addEventListener("change", function () {
    _pageSize = Number(this.value);
    resetPage();
    renderPage();
  });

  // Phân trang
  document.querySelector(".prev").addEventListener("click", () => {
    goPrevPage();
    renderPage();
  });

  document.querySelector(".next").addEventListener("click", () => {
    goNextPage();
    renderPage();
  });

  // Modal thêm ứng viên
  document.querySelector(".add-candidates").addEventListener("click", () => {
    document.getElementById("form__add").classList.add("display-block");
  });

  document.querySelector(".form__footer__btn--cancel").addEventListener("click", () => {
    document.getElementById("form__add").classList.remove("display-block");
  });

  document.querySelector(".form__bg").addEventListener("click", () => {
    document.getElementById("form__add").classList.remove("display-block");
  });
}