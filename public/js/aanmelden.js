$(document).ready(function () {
  $("#login").submit(function (e) {
    e.preventDefault();

    $("#submit").prop("disabled", true);

    $.ajax({
      type: "POST",
      url: "./aanmelden",
      data: $(this).serialize(),
      success: function (response) {
        if (response == "success") {
          window.location = "./admin";
        } else {
          $("#loginInfo").removeClass("hidden");
          if (response == "failure") {
            $("#loginInfo").removeClass("bg-red-100 border-red-200");
            $("#loginInfo").addClass("bg-yellow-100 border-yellow-200");
            $("#loginInfo").html(
              "Het e-mailadres en/of het wachtwoord dat u heeft opgegeven is incorrect. Probeer opnieuw."
            );
          } else if (response == "error") {
            $("#loginInfo").removeClass("bg-yellow-100 border-yellow-200");
            $("#loginInfo").addClass("bg-red-100 border-red-200");
            $("#loginInfo").html(
              'Er ging iets mis! Contacteer een site admin op <a href="admin@scoutswondelgem.be">admin@scoutswondelgem.be</a>.'
            );
          }
          $("#password").val("");

          $("#submit").prop("disabled", false);
        }
      },
    });
  });
});
