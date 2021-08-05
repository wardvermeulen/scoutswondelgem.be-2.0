$(document).ready(function () {
  $("#wachtwoord").submit(function (e) {
    e.preventDefault();

    $("#wachtwoordInfo").removeClass();

    $("#wachtwoordSubmit").prop("disabled", true);
    $("#wachtwoordSubmit").html(
      'Opslaan <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: "/admin/account/wachtwoord",
      type: "POST",
      data: $(this).serialize(),
      success: function (response) {
        if (response.type === "error") {
          $("#wachtwoordInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#wachtwoordInfo").addClass("alert alert-success");
        }

        $("#wachtwoordInfo").html(response.msg);

        $("#wachtwoordSubmit").prop("disabled", false);
        $("#wachtwoordSubmit").html("Opslaan");
      },
    });
  });
});
