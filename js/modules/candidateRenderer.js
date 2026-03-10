// Render danh sách ứng viên ra UI

const DEFAULT_AVATAR =
  "https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&width=64&height=64";

function renderCandidates(candidates) {
  const tbody = document.querySelector(".candidate-table tbody");

  tbody.innerHTML = "";

  // check nếu k có ứng viên thì:
  if (!candidates || candidates.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td>
          Chưa có ứng viên nào
        </td>
      </tr>`;
    return;
  }

  // nếu có ứng viên
  candidates.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="checkbox"><input type="checkbox"></td>
      <td>
        <div class="avatar-cell">
          <img class="avatar" src="${DEFAULT_AVATAR}" alt="${employee.fullName || "--"}">
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

  document.querySelector(".total-record").textContent =
    `Tổng bản ghi: ${total}`;
  document.querySelector(".index-record").textContent =
    `${start} - ${end} bản ghi`;

  if (isFirstPage()) {
    document.querySelector(".prev").disabled = true;
  } else {
    document.querySelector(".prev").disabled = false;
  }
  if (isLastPage()) {
    document.querySelector(".next").disabled = true;
  } else {
    document.querySelector(".next").disabled = false;
  }
}
