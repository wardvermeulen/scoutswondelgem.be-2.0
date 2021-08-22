$(document).ready(function () {
  $("#wachtwoord").submit(function (e) {
    e.preventDefault();

    $("#wachtwoordSubmit").prop("disabled", true);

    $.ajax({
      url: "/admin/account/wachtwoord",
      type: "POST",
      data: $(this).serialize(),
      success: function (response) {
        $("#wachtwoordInfo").removeClass("hidden");
        if (response.type === "error") {
          $("#wachtwoordInfo").removeClass("bg-green-100 border-green-200");
          $("#wachtwoordInfo").addClass("bg-red-100 border-red-200");
        } else if (response.type === "success") {
          $("#wachtwoordInfo").removeClass("bg-red-100 border-red-200");
          $("#wachtwoordInfo").addClass("bg-green-100 border-green-200");
        }

        $("#wachtwoordInfo").html(response.msg);

        $("#wachtwoordSubmit").prop("disabled", false);
      },
    });
  });
});
