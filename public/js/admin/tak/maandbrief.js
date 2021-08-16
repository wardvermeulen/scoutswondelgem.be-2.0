$(document).ready(function () {
  var pathElements = window.location.pathname.split("/").filter(function (value) {
    return value !== "";
  });
  pathElements.splice(pathElements.length - (pathElements.length === 2 ? 0 : 1), 0, "maandbrief");
  const url = "/" + pathElements.join("/");

  $("#maandbrief").submit(function (e) {
    e.preventDefault();

    $("#maandbriefInfo").removeClass();

    $("#maandbriefSubmit").prop("disabled", true);
    $("#maandbriefSubmit").html(
      'Uploaden <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: url,
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: successFunction,
    });
  });

  $(".weergeven").click(function (e) {
    const naam = this.name;
    $.ajax({
      url: url,
      type: "PUT",
      data: {
        naam: naam,
      },
      success: successFunction,
    });
  });

  $(".verwijderen").click(function (e) {
    const naam = this.name;
    $.ajax({
      url: url,
      type: "DELETE",
      data: {
        naam: naam,
      },
      success: successFunction,
    });

    // Verwijder de rij uit de tabel.
    $(this).parent().parent().remove();
  });
});

function successFunction(response) {
  if (response.reload) {
    window.location.reload();
  }

  if (response.type === "error") {
    $("#maandbriefInfo").addClass("alert alert-danger mt-3");
  } else if (response.type === "success") {
    $("#maandbriefInfo").addClass("alert alert-success mt-3");
  }

  $("#maandbriefInfo").html(response.msg);

  $("#maandbriefSubmit").prop("disabled", false);
  $("#maandbriefSubmit").html("Uploaden");
}
