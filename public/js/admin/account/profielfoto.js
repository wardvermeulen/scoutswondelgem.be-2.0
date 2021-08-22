$(document).ready(function () {
  $("#profielfoto").submit(function (e) {
    e.preventDefault();

    $("#profielfotoSubmit").prop("disabled", true);

    $.ajax({
      url: "/admin/account/profielfoto",
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        $("#profielfotoInfo").removeClass("hidden");
        if (response.type === "error") {
          $("#profielfotoInfo").removeClass("bg-green-100 border-green-200");
          $("#profielfotoInfo").addClass("bg-red-100 border-red-200");
        } else if (response.type === "success") {
          $("#profielfotoInfo").removeClass("bg-red-100 border-red-200");
          $("#profielfotoInfo").addClass("bg-green-100 border-green-200");
          // Het toevoegen van de datum forceert de browser om de afbeelding te herladen.
          // Zie: https://stackoverflow.com/questions/2104949/how-to-reload-refresh-an-elementimage-in-jquery
          $("#profielfotoImg").attr("src", response.src + "?" + new Date().getTime());
          $("#profielfotoImg").attr("hidden", false);
        }

        $("#profielfotoInfo").html(response.msg);

        $("#profielfotoSubmit").prop("disabled", false);
      },
    });
  });
});
