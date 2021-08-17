var React = require("react");
var Layout = require("./../../layout");

function AlbumToevoegen(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <form method="POST" id="album" encType="multipart/form-data">
          <div className="form-group">
            <p id="albumInfo"></p>

            <input type="text" name="albumnaam" className="form-control" placeholder="Albumnaam" />
            <input type="file" name="omslagfoto" />
            <button type="submit" className="btn btn-info" id="albumSubmit">
              Album aanmaken
            </button>
          </div>
        </form>
      </div>

      <script src="/js/admin/fotos/album_toevoegen.js"></script>
    </Layout>
  );
}

module.exports = AlbumToevoegen;
