// Quản lý toàn bộ thao tác với localStorage

// toast thông báo
const toaster = new ToasterUi();

// lưu data mặc định vào storage nếu chưa có
function saveDefaultDataToStorage() {
  // Chỉ lưu khi storage chưa có data
  if (localStorage.getItem(CONFIG.STORAGE_KEY)) return;
  if (typeof employees === "undefined" || employees.length === 0) return;

  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(employees));
}

// get tất cả ứng viên từ storage
function getAllCandidates() {
  const data = localStorage.getItem(CONFIG.STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// lưu data vào storage với message tương ứng theo action
function saveAllCandidates(data, action) {
  // Định nghĩa message theo action
  const messages = {
    add: {
      loading: "Đang thêm ứng viên mới...",
      success: "✅ Thêm ứng viên thành công!",
      error: "❌ Thêm ứng viên thất bại!",
    },
    update: {
      loading: "Đang cập nhật thông tin...",
      success: "✅ Cập nhật thông tin thành công!",
      error: "❌ Cập nhật thông tin thất bại!",
    },
    delete: {
      loading: "Đang xóa ứng viên...",
      success: "✅ Xóa ứng viên thành công!",
      error: "❌ Xóa ứng viên thất bại!",
    },
    saveAll: {
      loading: "Đang lưu tất cả dữ liệu...",
      success: "✅ Lưu tất cả dữ liệu thành công!",
      error: "❌ Lưu dữ liệu thất bại!",
    },
  };

  // Lấy message theo action, mặc định là saveAll
  const msg = messages[action] || messages.saveAll;

  // Hiển thị loading toast
  const toastId = toaster.addToast(msg.loading, "loading");

  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));

    // Cập nhật thành công với message tương ứng
    toaster.updateToast(toastId, msg.success, "success", {
      autoClose: true,
      duration: 3000,
    });
  } catch (error) {
    // Cập nhật lỗi với message tương ứng
    toaster.updateToast(toastId, msg.error, "error", {
      autoClose: true,
      duration: 4000,
    });

    console.error(`${action} error:`, error);
  }
}

// Thêm ứng viên mới
// tự động tạo employeeId mới dựa trên employeeId lớn nhất hiện có + 1
function addCandidate(newCandidate) {
  const candidates = getAllCandidates();

  const maxId = candidates.reduce(
    (max, emp) => (emp.employeeId > max ? emp.employeeId : max),
    0,
  );
  newCandidate.employeeId = maxId + 1;
  // thêm vào đầu mảng
  candidates.unshift(newCandidate);
  saveAllCandidates(candidates, 'add');
}

// Lấy thông tin ứng viên theo employeeId
function getCandidateById(employeeId) {
  const candidates = getAllCandidates();
  return (
    candidates.find((emp) => emp.employeeId === Number(employeeId)) || null
  );
}

// Cập nhật thông tin ứng viên đang sửa
function updateCandidate(candidateEditing) {
  const candidates = getAllCandidates();
  const index = candidates.findIndex(
    (emp) => emp.employeeId === candidateEditing.employeeId,
  );

  if (index === -1) return false;

  // Spread để giữ các field cũ, ghi đè field thay đổi
  candidates[index] = { ...candidates[index], ...candidateEditing };
  saveAllCandidates(candidates, 'update');
  return true;
}

// Xóa ứng viên theo employeeId
function deleteCandidateById(employeeId) {
  const candidates = getAllCandidates();
  const filtered = candidates.filter(
    (emp) => emp.employeeId !== Number(employeeId),
  );
  saveAllCandidates(filtered, 'delete');
}

// Xóa nhiều ứng viên theo employeeId
function deleteCandidatesByIds(ids) {
  // Xóa nhiều ứng viên 1 lần, chỉ ghi localStorage 1 lần
  const numericIds = ids.map(Number);
  const candidates = getAllCandidates();
  const filtered = candidates.filter(
    (emp) => !numericIds.includes(emp.employeeId),
  );
  saveAllCandidates(filtered, 'delete');
}
