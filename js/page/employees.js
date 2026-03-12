// --- Lưu trạng thái checkbox đã chọn ---
const _selectedIds = new Set();

function syncSelectedIdsFromDOM() {
  document.querySelectorAll('tbody input[type="checkbox"]:checked').forEach((cb) => {
    _selectedIds.add(Number(cb.dataset.id));
  });
  document.querySelectorAll('tbody input[type="checkbox"]:not(:checked)').forEach((cb) => {
    _selectedIds.delete(Number(cb.dataset.id));
  });
}

function restoreCheckboxState() {
  document.querySelectorAll('tbody input[type="checkbox"]').forEach((cb) => {
    cb.checked = _selectedIds.has(Number(cb.dataset.id));
  });

  // Cập nhật check-all
  const allCbs = document.querySelectorAll('tbody input[type="checkbox"]');
  const checkedCbs = document.querySelectorAll('tbody input[type="checkbox"]:checked');
  document.getElementById("checked-all").checked =
    allCbs.length > 0 && allCbs.length === checkedCbs.length;

  // Cập nhật toolbar
  if (_selectedIds.size > 0) {
    renderSelectedCount(_selectedIds.size);
    showSelectionToolbar();
  } else {
    showSearchBar();
  }
}

// hàm render lại trang sau khi có thay đổi dữ liệu
function renderPage() {
  renderCandidates(getPageData());
  renderPageInfo();
  restoreCheckboxState(); // khôi phục checkbox sau khi render
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

  const filtered = trimmed
    ? all.filter(
        (emp) =>
          emp.fullName?.toLowerCase().includes(trimmed) ||
          emp.phoneNumber?.toLowerCase().includes(trimmed) ||
          emp.email?.toLowerCase().includes(trimmed)
      )
    : all;

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
  return Array.from(_selectedIds).map(String);
}

function uncheckAll() {
  _selectedIds.clear();
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

    // Sync state vào Set ngay khi người dùng thay đổi
    syncSelectedIdsFromDOM();

    if (_selectedIds.size > 0) {
      renderSelectedCount(_selectedIds.size);
      showSelectionToolbar();
    } else {
      showSearchBar();
    }

    // Cập nhật check-all
    const allCbs = document.querySelectorAll('tbody input[type="checkbox"]');
    const checkedCbs = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    document.getElementById("checked-all").checked =
      allCbs.length > 0 && allCbs.length === checkedCbs.length;
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
  document
    .getElementById("select_page_size")
    .addEventListener("change", function () {
      syncSelectedIdsFromDOM();
      setPageSize(Number(this.value));
      resetPage();
      renderPage();
    });

  // Phân trang - sync trước khi chuyển trang
  document.querySelector(".prev").addEventListener("click", () => {
    syncSelectedIdsFromDOM();
    goPrevPage();
    renderPage();
  });
  document.querySelector(".next").addEventListener("click", () => {
    syncSelectedIdsFromDOM();
    goNextPage();
    renderPage();
  });

  // Mở modal thêm
  document
    .querySelector(".add-candidates")
    .addEventListener("click", openAddModal);

  // Đóng modal (nút Hủy & click backdrop)
  document
    .querySelector(".form__footer__btn--cancel")
    .addEventListener("click", closeModal);
  document.querySelector(".form__bg").addEventListener("click", closeModal);

  // Lưu ứng viên
  document
    .querySelector(".form__footer__btn--save")
    .addEventListener("click", handleSaveCandidate);

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
      _selectedIds.delete(Number(deleteBtn.dataset.id));
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

    deleteCandidatesByIds(ids);
    _selectedIds.clear();
    showSearchBar();
    displayAllCandidates();
  });

  // Check all / uncheck all cho trang hiện tại
  document.getElementById("checked-all").addEventListener("click", function () {
    const isChecked = this.checked;
    getPageData().forEach((emp) => {
      const cb = document.querySelector(`input[data-id="${emp.employeeId}"]`);
      if (cb) cb.checked = isChecked;

      if (isChecked) {
        _selectedIds.add(emp.employeeId);
      } else {
        _selectedIds.delete(emp.employeeId);
      }
    });

    if (_selectedIds.size > 0) {
      renderSelectedCount(_selectedIds.size);
      showSelectionToolbar();
    } else {
      showSearchBar();
    }
  });

  // Lắng nghe thay đổi checkbox
  initCheckboxListener();
}