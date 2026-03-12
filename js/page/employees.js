
// hàm render lại trang sau khi có thay đổi dữ liệu
function renderPage() { 
  // render thông tin bảng
  renderCandidates(getPageData());
  // render phân trang
  renderPageInfo();
}
 
// hàm hiển thị toàn bộ ứng viên
function displayAllCandidates() {
  setCurrentCandidates(getAllCandidates());
  resetPage();
  renderPage();
}
 
function searchCandidates(keyword) {
  const trimmed = keyword.trim().toLowerCase();
  const all = getAllCandidates();
 
  const filtered = trimmed ? all.filter((emp) =>
          emp.fullName?.toLowerCase().includes(trimmed) ||
          emp.phoneNumber?.toLowerCase().includes(trimmed) ||
          emp.email?.toLowerCase().includes(trimmed)) : all;
 
  setCurrentCandidates(filtered);
  resetPage();
  renderPage();
}
 
// --- Modal helpers ---
 
function openAddModal() {
  resetForm();
  document.getElementById("form__add").classList.add("display-block");
}
 
function openEditModal(employeeId) {
  const candidate = getCandidateById(employeeId);
  if (!candidate) return;
 
  setEditingId(candidate.employeeId);
  fillFormForEdit(candidate);
  document.querySelector(".form__header__title").textContent =
    "Chỉnh sửa thông tin ứng viên";
  document.getElementById("form__add").classList.add("display-block");
}
 
function closeModal() {
  document.getElementById("form__add").classList.remove("display-block");
  resetForm();
}
 
// --- Lưu ứng viên (thêm mới hoặc cập nhật) ---
 
function handleSaveCandidate() {
  const formData = getFormValues();
  if (!validateForm(formData)) return;
 
  const editingId = getEditingId();
  if (editingId) {
    formData.employeeId = editingId;
    updateCandidate(formData);
  } else {
    addCandidate(formData);
  }
 
  displayAllCandidates();
  closeModal();
}
 
// --- Checkbox logic ---
 
function getCheckedIds() {
  return Array.from(
    document.querySelectorAll('tbody input[type="checkbox"]:checked')
  ).map((cb) => cb.dataset.id);
}
 
function uncheckAll() {
  document
    .querySelectorAll('tbody input[type="checkbox"]:checked')
    .forEach((x) => (x.checked = false));
  document.getElementById("checked-all").checked = false;
  renderSelectedCount(0);
  showSearchBar();
}
 
// Theo dõi trạng thái checkbox trong tbody 
function initCheckboxListener() {
  document.querySelector("tbody").addEventListener("change", (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;
 
    const checkedIds = getCheckedIds();
    if (checkedIds.length > 0) {
      renderSelectedCount(checkedIds.length);
      showSelectionToolbar();
    } else {
      showSearchBar();
    }
  });
}
 
// --- Init trang ---
 
function initCandidatePage() {
  saveDefaultDataToStorage();
  displayAllCandidates();
 
  // Tìm kiếm
  document.getElementById("input-search").addEventListener("input", function () {
    searchCandidates(this.value);
  });
 
  // Đổi số bản ghi/trang
  document.getElementById("select_page_size").addEventListener("change", function () {
    setPageSize(Number(this.value));
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
 
  // Mở modal thêm
  document.querySelector(".add-candidates").addEventListener("click", openAddModal);
 
  // Đóng modal (nút Hủy & click backdrop)
  document.querySelector(".form__footer__btn--cancel").addEventListener("click", closeModal);
  document.querySelector(".form__bg").addEventListener("click", closeModal);
 
  // Lưu ứng viên
  document.querySelector(".form__footer__btn--save").addEventListener("click", handleSaveCandidate);
 
  // Nút Sửa / Xóa trong bảng (event delegation)
  document.querySelector("tbody").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      openEditModal(editBtn.dataset.id);
      return;
    }
 
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      if (!confirm("Bạn có chắc muốn xóa ứng viên này?")) return;
      deleteCandidateById(deleteBtn.dataset.id);
      displayAllCandidates();
    }
  });
 
  // Bỏ chọn tất cả
  document.querySelector(".unselect").addEventListener("click", uncheckAll);
 
  // Xóa các ứng viên đã chọn
  document.getElementById("delete-selected").addEventListener("click", () => {
    const ids = getCheckedIds();
    if (ids.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${ids.length} ứng viên đã chọn?`)) return;
 
    // Xóa 1 lần, ghi storage 1 lần (hiệu quả hơn xóa từng cái)
    deleteCandidatesByIds(ids);
    showSearchBar();
    displayAllCandidates();
  });
 
  // Check all / uncheck all
  document.getElementById("checked-all").addEventListener("click", function () {
    const isChecked = this.checked;
    getPageData().forEach((emp) => {
      const cb = document.querySelector(`input[data-id="${emp.employeeId}"]`);
      if (cb) cb.checked = isChecked;
    });
 
    const count = isChecked ? getPageData().length : 0;
    if (count > 0) {
      renderSelectedCount(count);
      showSelectionToolbar();
    } else {
      showSearchBar();
    }
  });

  // nếu bỏ 1 checkbox nào đó, thì cũng bỏ check cho nút check-all
  document.addEventListener("click", (e) => {
  if (e.target.type === "checkbox" && e.target.id !== "checked-all") {
    
    const allCheckbox = document.querySelectorAll('tbody input[type="checkbox"]');
    const checkedCheckbox = document.querySelectorAll('tbody input[type="checkbox"]:checked');

    const checkAll = document.getElementById("checked-all");

    if (allCheckbox.length === checkedCheckbox.length) {
      checkAll.checked = true;
    } else {
      checkAll.checked = false;
    }
  }
});
  // Lắng nghe thay đổi checkbox
  initCheckboxListener();
}