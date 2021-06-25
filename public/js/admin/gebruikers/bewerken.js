$(document).ready(function () {
  $("#bewerken").submit(function (e) {
    e.preventDefault();

    $("#submit").prop("disabled", true);
    $("#submit").html(
      'Aanmelden <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      type: "POST",
      url: window.location.pathname,
      data: $(this).serialize(),
      success: function (response) {
        if (response == "success") {
          $("#bewerkenInfo").removeClass("alert-danger");
          $("#bewerkenInfo").addClass("alert alert-success");
          response = "Gebruiker succesvol bijgewerkt!";
        } else {
          $("#bewerkenInfo").removeClass("alert-success");
          $("#bewerkenInfo").addClass("alert alert-danger");
        }
        $("#bewerkenInfo").html(response);
        $(window).scrollTop(0);
        $("#submit").prop("disabled", false);
        $("#submit").html("Opslaan");
      },
    });
  });
});
