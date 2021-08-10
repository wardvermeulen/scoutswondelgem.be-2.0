var toolbarOptions = [["bold", "italic", "underline"], ["blockquote"], [{ list: "ordered" }, { list: "bullet" }]];

var quill = new Quill("#tekstjeEditor", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
  placeholder: "Schrijf hier je persoonlijk tekstje.",
});

$(document).ready(function () {
  var pathElements = window.location.pathname.split("/").filter(function (value) {
    return value !== "";
  });
  pathElements.splice(pathElements.length - (pathElements.length === 2 ? 0 : 1), 0, "tekstje");
  const url = "/" + pathElements.join("/");

  $.ajax({
    url: url,
    method: "GET",
    success: function (response) {
      quill.setContents(response);
    },
  });

  $("#tekstje").submit(function (e) {
    e.preventDefault();

    const tekstjeJson = quill.getContents();
    const tekstjeHtml = quill.root.innerHTML;

    $("#tekstjeInfo").removeClass();

    $("#tekstjeSubmit").prop("disabled", true);
    $("#tekstjeSubmit").html(
      'Opslaan <span class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>'
    );

    $.ajax({
      url: url,
      method: "POST",
      data: {
        tekstje_json: JSON.stringify(tekstjeJson),
        tekstje_html: tekstjeHtml,
      },
      success: function (response) {
        if (response.type === "error") {
          $("#profielfotoInfo").addClass("alert alert-danger");
        } else if (response.type === "success") {
          $("#tekstjeInfo").addClass("alert alert-success");
        }

        $("#tekstjeInfo").html(response.msg);

        $("#tekstjeSubmit").prop("disabled", false);
        $("#tekstjeSubmit").html("Opslaan");
      },
    });
  });
});
