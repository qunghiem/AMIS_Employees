// Quản lý toàn bộ thao tác với localStorage
function saveDefaultDataToStorage() {
  // Chỉ lưu khi storage chưa có data
  if (localStorage.getItem(CONFIG.STORAGE_KEY)) return;
  if (typeof employees === "undefined" || employees.length === 0) return;
 
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(employees));
}
 
function getAllCandidates() {
  const data = localStorage.getItem(CONFIG.STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
 
function saveAllCandidates(data) {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
}
 
function addCandidate(newCandidate) {
  const candidates = getAllCandidates();
 
  const maxId = candidates.reduce(
    (max, emp) => (emp.employeeId > max ? emp.employeeId : max),
    0
  );
  newCandidate.employeeId = maxId + 1;
 
  candidates.unshift(newCandidate);
  saveAllCandidates(candidates);
}
 
function getCandidateById(employeeId) {
  const candidates = getAllCandidates();
  // Fix: typo "nulll" → null
  return (
    candidates.find((emp) => emp.employeeId === Number(employeeId)) || null
  );
}
 
function updateCandidate(candidateEditing) {
  const candidates = getAllCandidates();
  const index = candidates.findIndex(
    (emp) => emp.employeeId === candidateEditing.employeeId
  );
 
  if (index === -1) return false;
 
  // Spread để giữ các field cũ, ghi đè field thay đổi
  candidates[index] = { ...candidates[index], ...candidateEditing };
  saveAllCandidates(candidates);
  return true;
}
 
function deleteCandidateById(employeeId) {
  const candidates = getAllCandidates();
  const filtered = candidates.filter(
    (emp) => emp.employeeId !== Number(employeeId)
  );
  saveAllCandidates(filtered);
}
 
function deleteCandidatesByIds(ids) {
  // Xóa nhiều ứng viên 1 lần, chỉ ghi localStorage 1 lần
  const numericIds = ids.map(Number);
  const candidates = getAllCandidates();
  const filtered = candidates.filter(
    (emp) => !numericIds.includes(emp.employeeId)
  );
  saveAllCandidates(filtered);
}