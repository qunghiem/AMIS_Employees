// Quản lý toàn bộ thao tác với localStorage

const STORAGE_KEY = "candidates_data";

function saveDefaultDataToStorage() {
  // Chỉ lưu khi storage chưa có data
  if (localStorage.getItem(STORAGE_KEY)) return;
  if (typeof employees === "undefined" || employees.length === 0) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

// lấy ra danh sách ứng viên trong Storage
function getAllCandidates() {
  const datas = localStorage.getItem(STORAGE_KEY);
  return datas ? JSON.parse(datas) : [];
}

// lưu vào Storage
function saveAllCandidates(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}