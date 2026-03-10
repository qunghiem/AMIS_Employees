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

// hàm lưu thêm ứng viên 
function handleSaveCandidate() {
  // lấy data ứng viên từ các ô input
  const newCandidate = getFormValues();

  // kiểm tra validate data 
  if(!validateForm(newCandidate)) return;

  // add ứng viên vào storage
  addCandidate(newCandidate);

  // hiển thị data mới
  displayCandidates();

  // reset form 
  resetForm();

  // đóng model
  document.getElementById("form__add").classList.remove("display-block");

}
// Khởi tạo sự kiện
function initCandidatePage() {
  saveDefaultDataToStorage();
  displayCandidates();

  // Tìm kiếm
  document.getElementById("input-search").addEventListener("input", function () {
    searchCandidates(this.value);
  });

  // Thay đổi pageSize - số bản ghi trong 1 trang
  document.getElementById("select_page_size").addEventListener("change", function () {
    _pageSize = Number(this.value);
    resetPage();
    renderPage();
  });

  // Phân trang - lùi trang
  document.querySelector(".prev").addEventListener("click", () => {
    goPrevPage();
    renderPage();
  });

  // Phân trang - tiến trang
  document.querySelector(".next").addEventListener("click", () => {
    goNextPage();
    renderPage();
  });

  // Modal thêm ứng viên
  // bắt sự kiện click mở Modal
  document.querySelector(".add-candidates").addEventListener("click", () => {
    document.getElementById("form__add").classList.add("display-block");
  });

  // đóng Modal
  document.querySelector(".form__footer__btn--cancel").addEventListener("click", () => {
    document.getElementById("form__add").classList.remove("display-block");
  });

  // hủy Modal
  document.querySelector(".form__bg").addEventListener("click", () => {
    document.getElementById("form__add").classList.remove("display-block");
  });

  // lưu/ thêm thông tin ứng viên
  document.querySelector(".form__footer__btn--save").addEventListener("click", handleSaveCandidate);
}