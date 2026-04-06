document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("show");
    });
  }
});
