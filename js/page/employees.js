// Lưu trạng thái checkbox đã chọn
const _selectedIds = new Set();

function syncSelectedIdsFromDOM() {
  document
    .querySelectorAll('tbody input[type="checkbox"]:checked')
    .forEach((cb) => {
      _selectedIds.add(Number(cb.dataset.id));
    });
  document
    .querySelectorAll('tbody input[type="checkbox"]:not(:checked)')
    .forEach((cb) => {
      _selectedIds.delete(Number(cb.dataset.id));
    });
}

// Hàm khôi phục trạng thái checkbox sau khi render lại trang
function restoreCheckboxState() {
  document.querySelectorAll('tbody input[type="checkbox"]').forEach((cb) => {
    cb.checked = _selectedIds.has(Number(cb.dataset.id));
  });

  // Cập nhật check-all
  const allCbs = document.querySelectorAll('tbody input[type="checkbox"]');
  const checkedCbs = document.querySelectorAll(
    'tbody input[type="checkbox"]:checked',
  );
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

// Tìm kiếm ứng viên theo tên, sđt, email
function searchCandidates(keyword) {
  const trimmed = keyword.trim().toLowerCase();
  const all = getAllCandidates();

  const filtered = trimmed
    ? all.filter(
        (emp) =>
          emp.fullName?.toLowerCase().includes(trimmed) ||
          emp.phoneNumber?.toLowerCase().includes(trimmed) ||
          emp.email?.toLowerCase().includes(trimmed),
      )
    : all;

  setCurrentCandidates(filtered);
  resetPage();
  renderPage();
}

// mở modal thêm mới
function openAddModal() {
  resetForm();
  document.getElementById("form__add").classList.add("display-block");
}

// mở modal sửa, điền dữ liệu vào form
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

//Lưu ứng viên
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

// Lấy danh sách employeeId đang tích chọn
function getCheckedIds() {
  return Array.from(_selectedIds).map(String);
}

// Bỏ chọn tất cả ô đang tích
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
    const checkedCbs = document.querySelectorAll(
      'tbody input[type="checkbox"]:checked',
    );
    document.getElementById("checked-all").checked =
      allCbs.length > 0 && allCbs.length === checkedCbs.length;
  });
}

//Init trang
function initCandidatePage() {
  saveDefaultDataToStorage();
  displayAllCandidates();
  initAvatarUpload();
  initCVUpload();

  // Tìm kiếm
  document
    .getElementById("input-search")
    .addEventListener("input", function () {
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
// Lắng nghe click từ overflow menu
document.addEventListener("overflow-menu-click", (e) => {
  const { id } = e.detail;

  if (id === "delete-selected") {
    const ids = getCheckedIds();
    if (ids.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${ids.length} ứng viên đã chọn?`)) return;
    deleteCandidatesByIds(ids);
    _selectedIds.clear();
    showSearchBar();
    displayAllCandidates();
    return;
  }

  // Các action khác (send-email, tag-manager, v.v.) xử lý thêm ở đây
  console.log("Menu action:", id, "| Selected:", getCheckedIds());
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

  initOverflowMenu();

  // Lắng nghe thay đổi checkbox
  initCheckboxListener();
}
