$(document).ready(function () {
  $("#info").submit(function (e) {
    e.preventDefault();

    $("#infoInfo").removeClass();

    $("#infoSubmit").prop("disabled", true);
    $("#infoSubmit").html(
      'Opslaan <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: "/admin/account/info",
      type: "POST",
      data: $(this).serialize(),
      success: function (response) {
        if (response.type === "error") {
          $("#infoInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#infoInfo").addClass("alert alert-success");
        }

        $("#infoInfo").html(response.msg);

        $("#infoSubmit").prop("disabled", false);
        $("#infoSubmit").html("Opslaan");
      },
    });
  });
});
