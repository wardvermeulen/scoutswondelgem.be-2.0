$(document).ready(function () {
  $("#profielfoto").submit(function (e) {
    e.preventDefault();
    $("#profielfotoInfo").removeClass();
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
          $("#profielfotoImg").attr("src", response.src);
        }
        $("#profielfotoInfo").html(response.msg);
      },
    });
  });
});
