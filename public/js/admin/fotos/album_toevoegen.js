$(document).ready(function () {
  var pathElements = window.location.pathname.split("/");
  pathElements.splice(pathElements.length - 1, 1);
  const url = pathElements.join("/");

  $("#album").submit(function (e) {
    e.preventDefault();

    $("#albumInfo").removeClass();

    $("#albumSubmit").prop("disabled", true);
    $("#albumSubmit").html(
      'Categorie aanmaken <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: window.location.pathname,
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.type === "error") {
          $("#albumInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          window.location = url;
        }

        $("#albumInfo").html(response.msg);

        $("#albumSubmit").prop("disabled", false);
        $("#albumSubmit").html("Categorie aanmaken");
      },
    });
  });
});
