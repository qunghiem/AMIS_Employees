// Quản lý trạng thái & logic phân trang

let _currentPage = 1;
let _pageSize = 10;
let _currentCandidates = [];

function setCurrentCandidates(candidates) {
  _currentCandidates = candidates;
}

function resetPage() {
  _currentPage = 1;
}

// lấy ra danh sách ứng viên theo page
function getPageData() {
  const start = (_currentPage - 1) * _pageSize;
  const end = start + _pageSize;
  return _currentCandidates.slice(start, end);
}

// tiến sang trang
function goNextPage() {
  if (_currentPage * _pageSize >= _currentCandidates.length) return;
  _currentPage++;
}

// lùi trang
function goPrevPage() {
  if (_currentPage <= 1) return;
  _currentPage--;
}

// kiểm tra có phải trang đầu không
function isFirstPage() {
  return _currentPage <= 1;
}

// kiểm tra có phải trang cuổi không
function isLastPage() {
  return _currentPage * _pageSize >= _currentCandidates.length;
}

function getPageInfo() {
  let total = _currentCandidates.length;
  let start = (_currentPage - 1) * _pageSize + 1;
  let end = start + _pageSize - 1;
  if (end > total) end = total;
  return { start, end, total };
}