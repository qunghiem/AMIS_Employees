// code dùng chung cho nhiều trang, toàn app: validate, noti,..

// thu gọn sidebar
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".sidebar__toggle");
  const sidebar = document.querySelector(".layout__sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      // add-remove class "collapsed" khi click vào button
      sidebar.classList.toggle("collapsed");
    });
  }

  initEventData();
});
