$(document).ready(function () {
  const btn = $("button#mobile-menu-button");
  const menu = $("#mobile-menu");
  const hamburgerOpen = $("#hamburger-open");
  const hamburgerClose = $("#hamburger-close");

  console.log(btn);

  btn.click(function (e) {
    menu.toggleClass("hidden");
    hamburgerOpen.toggleClass("hidden");
    hamburgerClose.toggleClass("hidden");
  });
});
