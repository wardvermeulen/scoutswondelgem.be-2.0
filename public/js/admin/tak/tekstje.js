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

    $("#tekstjeSubmit").prop("disabled", true);

    $.ajax({
      url: url,
      method: "POST",
      data: {
        tekstje_json: JSON.stringify(tekstjeJson),
        tekstje_html: tekstjeHtml,
      },
      success: function (response) {
        $("#tekstjeInfo").removeClass("hidden");
        if (response.type === "error") {
          $("#tekstjeInfo").removeClass("bg-green-100 border-green-200");
          $("#tekstjeInfo").addClass("bg-red-100 border-red-200");
        } else if (response.type === "success") {
          $("#tekstjeInfo").removeClass("bg-red-100 border-red-200");
          $("#tekstjeInfo").addClass("bg-green-100 border-green-200");
        }

        $("#tekstjeInfo").html(response.msg);

        $("#tekstjeSubmit").prop("disabled", false);
      },
    });
  });
});
