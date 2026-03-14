// Overflow menu: tự động ẩn items không vừa vào "Thêm ▼"

const MENU_ITEMS = [
  { id: "send-email",       label: "Gửi email" },
  { id: "tag-manager",      label: "Quản lý thẻ" },
  { id: "create-job",       label: "Tạo công việc" },
  { id: "add-campaign",     label: "Thêm vào chiến dịch" },
  { id: "to-talent-pool",   label: "Chuyển vào kho tiềm năng" },
  { id: "move-news",        label: "Chuyển đến tin khác" },
  { id: "bulk-update",      label: "Cập nhật hàng loạt" },
  { id: "download-cv",      label: "Tải xuống CV" },
  { id: "export",           label: "Xuất khẩu" },
  { id: "delete-selected",  label: "Xóa ứng viên đã chọn" },
];

// Đo width thực tế của 1 button (render ẩn ngoài màn hình)
function measureItemWidth(label) {
  const ghost = document.createElement("button");
  ghost.className = "btn-selected";
  ghost.style.cssText = "position:absolute;visibility:hidden;top:-9999px;white-space:nowrap;";
  ghost.textContent = label;
  document.body.appendChild(ghost);
  const w = ghost.getBoundingClientRect().width;
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

function buildButton(item, inDropdown = false) {
  if (inDropdown) {
    const div = document.createElement("div");
    div.className = "overflow-menu__dropdown-item";
    div.dataset.id = item.id;
    div.textContent = item.label;
    return div;
  }
  const btn = document.createElement("button");
  btn.className = "btn-selected";
  btn.dataset.id = item.id;
  btn.textContent = item.label;
  return btn;
}

function recalcOverflow() {
  const container   = document.getElementById("overflow-menu");
  const visible     = document.getElementById("overflow-visible");
  const moreBtn     = document.getElementById("overflow-more");
  const dropdown    = document.getElementById("overflow-dropdown");

  if (!container) return;

  const MORE_BTN_WIDTH = 90; // px reserved cho nút "Thêm ▼"
  const GAP = 6;
  const totalWidth = container.getBoundingClientRect().width;

  visible.innerHTML = "";
  dropdown.innerHTML = "";

  let used = 0;
  let overflowItems = [];
  let visibleItems = [];

  // Thử fit tất cả trước (không có nút More)
  let allFit = true;
  let totalAll = MENU_ITEMS.reduce((s, it) => s + getItemWidth(it), 0);
  if (totalAll > totalWidth) allFit = false;

  if (allFit) {
    // tất cả vừa, không cần nút more
    MENU_ITEMS.forEach(item => visibleItems.push(item));
    moreBtn.style.display = "none";
  } else {
    // Dành chỗ cho nút More
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