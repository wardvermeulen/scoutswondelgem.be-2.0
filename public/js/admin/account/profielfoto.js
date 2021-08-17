$(document).ready(function () {
  $("#profielfoto").submit(function (e) {
    e.preventDefault();

    $("#profielfotoInfo").removeClass();

    $("#profielfotoSubmit").prop("disabled", true);
    $("#profielfotoSubmit").html(
      'Uploaden <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: "/admin/account/profielfoto",
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.type === "error") {
          $("#profielfotoInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#profielfotoInfo").addClass("alert alert-success");
          // Het toevoegen van de datum forceert de browser om de afbeelding te herladen.
          // Zie: https://stackoverflow.com/questions/2104949/how-to-reload-refresh-an-elementimage-in-jquery
          $("#profielfotoImg").attr("src", response.src + "?" + new Date().getTime());
          $("#profielfotoImg").attr("hidden", false);
        }

        $("#profielfotoInfo").html(response.msg);

        $("#profielfotoSubmit").prop("disabled", false);
        $("#profielfotoSubmit").html("Uploaden");
      },
    });
  });
});
