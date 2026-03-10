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

// hàm thêm ứng viên 
function addCandidate(newCandidate) {
  const candidates = getAllCandidates();

  // tạo id cho ứng viên mới, id sẽ là id lớn nhất + 1
  const maxId = candidates.reduce((max, emp) => {
    return emp.employeeId > max ? emp.employeeId : max;
  }, 0);
  newCandidate.employeeId = maxId + 1; // tạo id cho ứng viên mới

  candidates.unshift(newCandidate); // thêm vào đầu danh sách
  // lưu 
  saveAllCandidates(candidates);
}

// hàm lấy ứng viên theo id
function getCandadateById(employeeId) {
  const candidates = getAllCandidates();
  return candidates.find(employee => employee.employeeId === Number(employeeId)) || nulll;
}

// hàm cập nhật ứng viên
function updateCandidate(candidateEditing) {
  const candidates = getAllCandidates();

  const index = candidates.findIndex(emp => emp.employeeId === candidateEditing.employeeId);

  if(index === -1) return false;

  candidates[index] = {...candidates[index], ...candidateEditing };// đè 2 obj mới - cũ, ghì đè thuộc tính thay đổi

  saveAllCandidates(candidates);

  return true;
}

// hàm xóa ứng viên theo ID
function deleteCandidate(employeeId) {
  const candidates = getAllCandidates();

  const filtered = candidates.filter(emp => emp.employeeId !== Number(employeeId));

  saveAllCandidates(filtered);
}