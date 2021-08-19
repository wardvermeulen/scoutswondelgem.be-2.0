var React = require("react");

function Head(props) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

      <script
        src="https://code.jquery.com/jquery-3.5.1.min.js"
        integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossOrigin="anonymous"
      ></script>
      {/* <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
        crossOrigin="anonymous"
      />
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
        integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
        crossOrigin="anonymous"
      ></script> */}

      {/* <script src="/tmp/jquery-3.5.1.min.js"></script>
      <script src="/tmp/popper.min.js"></script>
      <link rel="stylesheet" href="/tmp/bootstrap.min.css" />
      <script src="/tmp/bootstrap.min.js"></script> */}

      <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>

      {/* Laat overal tooltips toe. */}
      {/* <script src="/js/tooltips.js"></script> */}
      <link rel="stylesheet" href="/stylesheets/tailwind-generated.css" />

      <script src="/js/navbar.js"></script>

      <title>{props.title}</title>
    </head>
  );
}

module.exports = Head;
