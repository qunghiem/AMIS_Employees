// code dùng chung cho toàn app

document.addEventListener("DOMContentLoaded", () => {

  // Toggle sidebar thu gọn / mở rộng
  const toggleBtn = document.querySelector(".sidebar__toggle");
  const sidebar = document.querySelector(".layout__sidebar");

  // bắt sự kiện click thu gọn - mở rộng sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // chạy trang ứng viên
  if (typeof initCandidatePage === "function") initCandidatePage();
});