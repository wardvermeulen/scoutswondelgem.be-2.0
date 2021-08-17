$(document).ready(function () {
  $("#album").submit(function (e) {
    e.preventDefault();

    $("#albumInfo").removeClass();

    $("#albumSubmit").prop("disabled", true);
    $("#albumSubmit").html(
      'Album aanmaken <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: "/admin/fotos/album_toevoegen",
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.type === "error") {
          $("#albumInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          window.location = "/admin/fotos";
        }

        $("#albumInfo").html(response.msg);

        $("#albumSubmit").prop("disabled", false);
        $("#albumSubmit").html("Album aanmaken");
      },
    });
  });
});
