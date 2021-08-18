$(document).ready(function () {
  var pathElements = window.location.pathname.split("/");
  pathElements.splice(pathElements.length - 1, 1);
  const url = pathElements.join("/");

  $("#fotos").submit(function (e) {
    e.preventDefault();

    $("#fotosInfo").removeClass();

    $("#fotosSubmit").prop("disabled", true);
    $("#fotosSubmit").html(
      'Foto\'s uploaden <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: window.location.pathname,
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.type === "error") {
          $("#fotosInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#fotosInfo").addClass("alert alert-success");
        }

        $("#fotosInfo").html(response.msg);

        $("#fotosSubmit").prop("disabled", false);
        $("#fotosSubmit").html("Foto's uploaden");
      },
    });
  });
});
