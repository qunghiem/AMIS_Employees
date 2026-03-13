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
 
// reset về trang đầu tiên
function resetPage() {
  _currentPage = 1;
}

// set lại kích thước trang
function setPageSize(size) {
  _pageSize = size;
}

// lấy dữ liệu ứng viên cho trang hiện tại
function getPageData() {
  const start = (_currentPage - 1) * _pageSize;
  const end = start + _pageSize;
  return _currentCandidates.slice(start, end);
}

// tiến trang 
function goNextPage() {
  if (isLastPage()) return;
  _currentPage++;
}
 
// lùi trang 
function goPrevPage() {
  if (isFirstPage()) return;
  _currentPage--;
}

// kiểm tra có đang ở trang đầu tiên
function isFirstPage() {
  return _currentPage <= 1;
}

// kiểm tra có đang ở trang cuối cùng
function isLastPage() {
  return _currentPage * _pageSize >= _currentCandidates.length;
}
 
// lấy thông tin phân trang để hiển thị
function getPageInfo() {
  const total = _currentCandidates.length;
  const start = total === 0 ? 0 : (_currentPage - 1) * _pageSize + 1;
  let end = start + _pageSize - 1;
  if (end > total) end = total;
  return { start, end, total };
}