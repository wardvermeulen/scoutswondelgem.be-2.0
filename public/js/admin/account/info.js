$(document).ready(function () {
  $("#info").submit(function (e) {
    e.preventDefault();

    $("#infoSubmit").prop("disabled", true);

    $.ajax({
      url: "/admin/account/info",
      type: "POST",
      data: $(this).serialize(),
      success: function (response) {
        $("#infoInfo").removeClass("hidden");
        if (response.type === "error") {
          $("#infoInfo").removeClass("bg-green-100 border-green-200");
          $("#infoInfo").addClass("bg-red-100 border-red-200");
        } else if (response.type === "success") {
          $("#infoInfo").removeClass("bg-red-100 border-red-200");
          $("#infoInfo").addClass("bg-green-100 border-green-200");
        }

        $("#infoInfo").html(response.msg);

        $("#infoSubmit").prop("disabled", false);
      },
    });
  });
});
