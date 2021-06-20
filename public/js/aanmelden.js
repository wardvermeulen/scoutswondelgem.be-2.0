$(document).ready(function () {
  $("#login").submit(function (e) {
    e.preventDefault();

    $("#submit").prop("disabled", true);
    $("#submit").html(
      'Aanmelden <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      type: "POST",
      url: "./aanmelden",
      data: $(this).serialize(),
      success: function (response) {
        if (response == "success") {
          window.location = "./admin";
        } else {
          if (response == "failure") {
            $("#loginInfo").addClass("alert alert-warning");
            $("#loginInfo").html(
              "Het e-mailadres en/of het wachtwoord dat u heeft opgegeven is incorrect. Probeer opnieuw."
            );
          } else if (response == "error") {
            $("#loginInfo").addClass("alert alert-danger");
            $("#loginInfo").html(
              'Er ging iets mis! Contacteer een site admin op <a href="admin@scoutswondelgem.be">admin@scoutswondelgem.be</a>.'
            );
          }
          $("#password").val("");
          $("#submit").prop("disabled", false);
          $("#submit").html("Aanmelden");
        }
      },
    });
  });
});
