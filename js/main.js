// code dùng chung cho toàn app

document.addEventListener("DOMContentLoaded", () => {

  // Toggle sidebar thu gọn / mở rộng
  const toggleBtn = document.querySelector(".sidebar__toggle");
  const sidebar = document.querySelector(".layout__sidebar");
  const sidebarToggle = document.querySelector(".sidebar__toggle");
 
  // bắt sự kiện clickthu gọn - mở rộng sidebar
  let checkToggle = false;
  toggleBtn.addEventListener("click", () => {
    if (!checkToggle) {
      sidebar.classList.add("collapsed");
      checkToggle = true;
      toggleBtn.style.justifyContent = "center";
      sidebarToggle.style.width = "70%";
    } else {
      sidebar.classList.remove("collapsed");
      checkToggle = false;
      toggleBtn.style.justifyContent = "flex-start";
      sidebarToggle.style.width = "87%";
    }
  });

  // chạy trang ứng viên
  if (typeof initCandidatePage === "function") initCandidatePage();
});