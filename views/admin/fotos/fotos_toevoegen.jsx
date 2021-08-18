var React = require("react");
var Layout = require("../../layout");

function FotosToevoegen(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <form method="POST" id="fotos" encType="multipart/form-data">
          <div className="form-group">
            <p id="fotosInfo"></p>

            <input type="file" name="fotos" multiple />
            <button type="submit" className="btn btn-info" id="fotosSubmit">
              Foto's uploaden
            </button>
          </div>
        </form>
      </div>

      <script src="/js/admin/fotos/fotos_toevoegen.js"></script>
    </Layout>
  );
}

module.exports = FotosToevoegen;
