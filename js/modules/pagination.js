// Quản lý trạng thái & logic phân trang

let _currentPage = 1;
let _pageSize = CONFIG.DEFAULT_PAGE_SIZE;
let _currentCandidates = []; // danh sách ứng viên đã lọc

// set lại danh sách ứng viên sau khi thêm/sửa/xóa
function setCurrentCandidates(candidates) {
  _currentCandidates = candidates;
}

// lấy tất cả ứng viên đã lọc 
function getCurrentCandidates() {
  return _currentCandidates;
}
 
function resetPage() {
  _currentPage = 1;
}
 
function setPageSize(size) {
  _pageSize = size;
}

// lấy dữ liệu ứng viên cho trang hiện tại
function getPageData() {
  const start = (_currentPage - 1) * _pageSize;
  const end = start + _pageSize;
  return _currentCandidates.slice(start, end);
}
 
function goNextPage() {
  if (isLastPage()) return;
  _currentPage++;
}
 
function goPrevPage() {
  if (isFirstPage()) return;
  _currentPage--;
}
 
function isFirstPage() {
  return _currentPage <= 1;
}
 
function isLastPage() {
  return _currentPage * _pageSize >= _currentCandidates.length;
}
 
function getPageInfo() {
  const total = _currentCandidates.length;
  const start = total === 0 ? 0 : (_currentPage - 1) * _pageSize + 1;
  let end = start + _pageSize - 1;
  if (end > total) end = total;
  return { start, end, total };
}