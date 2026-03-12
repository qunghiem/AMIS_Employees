// Render danh sách ứng viên ra UI
// Chỉ chứa logic hiển thị, không xử lý data/event

function renderCandidates(candidates) {
  const tbody = document.querySelector(".candidate-table tbody");
  tbody.innerHTML = "";
 
  if (!candidates || candidates.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="14" style="text-align:center; padding: 40px; color: #888;">
          Chưa có ứng viên nào
        </td>
      </tr>`;
    return;
  }
  

  candidates.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="checkbox">
        <input type="checkbox" data-id="${employee.employeeId}">
      </td>
      <td>
        <div class="avatar-cell">
          <img class="avatar" src="${CONFIG.DEFAULT_AVATAR}" alt="${employee.fullName || "--"}">
          ${employee.fullName || "--"}
        </div>
      </td>
      <td>${employee.phoneNumber || "--"}</td>
      <td>${employee.candidateSource || "--"}</td>
      <td title="${employee.email || "--"}">${employee.email || "--"}</td>
      <td>${employee.recruitmentCampaign || "--"}</td>
      <td>${employee.position || "--"}</td>
      <td>${employee.jobPosting || "--"}</td>
      <td>${employee.recruitmentStage || "--"}</td>
      <td>${employee.evaluation || "--"}</td>
      <td>${employee.country || "--"}</td>
      <td>${employee.province || "--"}</td>
      <td>${employee.ward || "--"}</td>
      <td class="col-action">
        <button class="btn-action btn-edit" title="Sửa" data-id="${employee.employeeId}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-action btn-delete" title="Xóa" data-id="${employee.employeeId}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    
    tbody.appendChild(row);
  });
}

 
function renderPageInfo() {
  const { start, end, total } = getPageInfo();
 
  document.querySelector(".total-record").textContent = `Tổng bản ghi: ${total}`;
  document.querySelector(".index-record").textContent = `${start} - ${end} bản ghi`;
  document.querySelector(".prev").disabled = isFirstPage();
  document.querySelector(".next").disabled = isLastPage();
}
 
// Cập nhật số lượng ứng viên đang chọn
function renderSelectedCount(count) {
  document.querySelector(".selected-count").textContent = `${count} đang chọn`;
}
 
// Hiện toolbar "đang chọn", ẩn thanh search
function showSelectionToolbar() {
  document.querySelector(".content__nav").classList.add("display-none");
  document.querySelector(".selected_content").classList.add("display-flex");
}
 
// Ẩn toolbar "đang chọn", hiện lại thanh search
function showSearchBar() {
  document.querySelector(".content__nav").classList.remove("display-none");
  document.querySelector(".selected_content").classList.remove("display-flex");
}