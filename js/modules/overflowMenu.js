// Overflow menu: tự động ẩn items không vừa vào "Thêm ▼"

const MENU_ITEMS = [
  { 
    id: "send-email",       
    label: "Gửi email",
    class: "btn-action-overflow"
  },
  { 
    id: "tag-manager",      
    label: "Quản lý thẻ",
    class: "btn-action-overflow"
  },
  { 
    id: "create-job",       
    label: "Tạo công việc" ,
    class: "btn-action-overflow"
  },
  { 
    id: "add-campaign",     
    label: "Thêm vào chiến dịch",
    class: "btn-action-overflow"
  },
  { 
    id: "to-talent-pool",   
    label: "Chuyển vào kho tiềm năng",
    class: "btn-action-overflow"
  },
  { 
    id: "move-news",        
    label: "Chuyển đến tin khác",
    class: "btn-action-overflow"
  },
  { 
    id: "bulk-update",      
    label: "Cập nhật hàng loạt",
    class: "btn-action-overflow"
  },
  { 
    id: "download-cv",      
    label: "Tải xuống CV",
    class: "btn-action-overflow"
  },
  { 
    id: "export",           
    label: "Xuất khẩu",
    class: "btn-action-overflow"
  },
  { 
    id: "delete-selected",  
    label: "Xóa ứng viên đã chọn",
    class: "btn-action-overflow"
  },
];

// Đo width thực tế của 1 button 
function measureItemWidth(label) {
  // tạo button giả
  const ghost = document.createElement("button");
  // gán class của btn thật
  ghost.className = "btn-selected";
  ghost.style.cssText = "position:absolute;visibility:hidden;top:-9999px;white-space:nowrap;";
  ghost.textContent = label;
  document.body.appendChild(ghost);
  // đo chiểu rộng
  const w = ghost.getBoundingClientRect().width;
  // xóa btn giả
  document.body.removeChild(ghost);
  return w;
}

// Cache width của từng item
const _itemWidths = {};
function getItemWidth(item) {
  if (!_itemWidths[item.id]) {
    _itemWidths[item.id] = measureItemWidth(item.label) + 6; // + gap
  }
  return _itemWidths[item.id];
}

// kiểm tra item đó có nằm trong drop down hay k, truyền class
function buildButton(item, inDropdown = false) {
  // đối với item nằm trong
  if (inDropdown) {
    const div = document.createElement("div");
    div.className = "overflow-menu__dropdown-item";
    div.dataset.id = item.id;
    // btn.id = item.id;
    div.textContent = item.label;
    return div;
  }
  // đối với item nằm ngoài
  const btn = document.createElement("button");
  btn.className = "btn-selected";
  btn.dataset.id = item.id;
  btn.id = item.id;
  btn.textContent = item.label;
  return btn;
}

// hàm tính toán xem width đủ chỗ hiện bao nhiêu button
function recalcOverflow() {
  const container   = document.getElementById("overflow-menu");
  // div hiển thỉ button chính
  const visible     = document.getElementById("overflow-visible");
  const moreBtn     = document.getElementById("overflow-more");
  // div hiển thị menu dropdown
  const dropdown    = document.getElementById("overflow-dropdown");

  if (!container) return;

  // set width cho nút more
  const MORE_BTN_WIDTH = 90; 
  // set gap giữa các btn
  const GAP = 6;
  // Lấy chiều rộng container
  const totalWidth = container.getBoundingClientRect().width;

  // Xóa menu cũ sau mỗi lần resize
  visible.innerHTML = "";
  dropdown.innerHTML = "";

  // width đã dùng
  let used = 0;
  // items hiển thị trong
  let overflowItems = [];
  // items hiển thị ngoài
  let visibleItems = [];

  // Thử fit tất cả trước 
  let allFit = true;
  // tính tổng width tất cả item
  let totalAll = MENU_ITEMS.reduce((sum, item) => sum + getItemWidth(item), 0);
  if (totalAll > totalWidth) allFit = false;

  if (allFit) {
    // tất cả vừa, không cần nút more
    MENU_ITEMS.forEach(item => visibleItems.push(item));
    moreBtn.style.display = "none";
  } else {
    // Dành chỗ cho nút More

    // tính width cho các item còn lại
    const budget = totalWidth - MORE_BTN_WIDTH - GAP;
    for (const item of MENU_ITEMS) {
      const w = getItemWidth(item);
      if (used + w <= budget) {
        visibleItems.push(item);
        used += w;
      } else {
        overflowItems.push(item);
      }
    }
    moreBtn.style.display = overflowItems.length > 0 ? "block" : "none";
  }

  visibleItems.forEach(item => visible.appendChild(buildButton(item, false)));
  overflowItems.forEach(item => dropdown.appendChild(buildButton(item, true)));
}

// Đóng dropdown khi click ngoài
document.addEventListener("click", (e) => {
  const moreBtn = document.getElementById("overflow-more");
  if (moreBtn && !moreBtn.contains(e.target)) {
    moreBtn.classList.remove("open");
  }
});

function initOverflowMenu() {
  const moreBtn = document.getElementById("overflow-more");
  if (moreBtn) {
    moreBtn.querySelector(".overflow-menu__trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      moreBtn.classList.toggle("open");
    });
  }

  // Click vào item (cả visible lẫn dropdown) → dispatch custom event
  document.getElementById("overflow-menu")?.addEventListener("click", (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;
    const id = target.dataset.id;
    document.dispatchEvent(new CustomEvent("overflow-menu-click", { detail: { id } }));
    // đóng dropdown
    document.getElementById("overflow-more")?.classList.remove("open");
  });

  // Recalc khi resize
  const resizeObs = new ResizeObserver(() => recalcOverflow());
  const container = document.getElementById("overflow-menu");
  if (container) resizeObs.observe(container);

  recalcOverflow();
}