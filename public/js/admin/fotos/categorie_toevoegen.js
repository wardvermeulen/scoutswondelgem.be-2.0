$(document).ready(function () {
  $("#categorie").submit(function (e) {
    e.preventDefault();

    $("#categorieInfo").removeClass();

    $("#categorieSubmit").prop("disabled", true);
    $("#categorieSubmit").html(
      'Categorie aanmaken <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: "/admin/fotos/categorie_toevoegen",
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.type === "error") {
          $("#categorieInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          window.location = "/admin/fotos";
        }

        $("#categorieInfo").html(response.msg);

        $("#categorieSubmit").prop("disabled", false);
        $("#categorieSubmit").html("Categorie aanmaken");
      },
    });
  });
});
