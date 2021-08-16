$(document).ready(function () {
  var pathElements = window.location.pathname.split("/").filter(function (value) {
    return value !== "";
  });
  pathElements.splice(pathElements.length - (pathElements.length === 2 ? 0 : 1), 0, "email");
  const url = "/" + pathElements.join("/");

  $("#email").submit(function (e) {
    e.preventDefault();

    $("#emailInfo").removeClass();

    $("#emailSubmit").prop("disabled", true);
    $("#emailSubmit").html(
      'Opslaan <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: url,
      method: "POST",
      data: $(this).serialize(),
      success: function (response) {
        if (response.type === "error") {
          $("#emailInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#emailInfo").addClass("alert alert-success");
        }

        $("#emailInfo").html(response.msg);

        $("#emailSubmit").prop("disabled", false);
        $("#emailSubmit").html("Opslaan");
      },
    });
  });
});
