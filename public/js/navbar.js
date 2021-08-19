$(document).ready(function () {
  const btn = $("button#mobile-menu-button");
  const menu = $("#mobile-menu");
  const hamburgerOpen = $("#hamburger-open");
  const hamburgerClose = $("#hamburger-close");

  btn.click(function (e) {
    menu.toggleClass("hidden");
    hamburgerOpen.toggleClass("hidden");
    hamburgerClose.toggleClass("hidden");
  });

  const dropdown = $("button.dropdown-button");

  dropdown.click(function (e) {
    // Het dropdown menu dat standaard verborgen is
    const dropdownMenu = $(this).parent().next();
    const alreadyHidden = dropdownMenu.hasClass("hidden");

    // Verberg alle dropdowns
    $(".dropdown-menu").addClass("hidden");

    // Als het menu al verborgen was, dan moet het nu getoond worden.
    // In het andere geval is er al voor een 2e keer op geklikt en moet het terug verborgen worden.
    if (alreadyHidden) {
      dropdownMenu.removeClass("hidden");
    }
  });

  $(document).click(function (e) {
    if ($(e.target).parents(".dropdown").length === 0) {
      $(".dropdown-menu").removeClass("hidden");
      $(".dropdown-menu").addClass("hidden");
    }
  });
});
