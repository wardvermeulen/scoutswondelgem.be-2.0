var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.tak.naam}</h1>

        <form method="POST" id="tekstje">
          <div className="form-group">
            <p id="tekstjeInfo"></p>
            <label htmlFor="tekstjeEditor" className="ml-3">
              Tekstje van de tak. Wees niet bang om dit ooit eens aan te passen.
            </label>
            <div id="tekstjeEditor"></div>
            <button type="submit" id="tekstjeSubmit">
              Opslaan
            </button>
          </div>
        </form>

        <hr />
      </div>

      <script src="/js/admin/tak/tekstje.js"></script>
    </Layout>
  );
}

module.exports = Index;
