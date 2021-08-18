var React = require("react");
var Layout = require("../../layout");

function CategorieToevoegen(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <form method="POST" id="categorie" encType="multipart/form-data">
          <div className="form-group">
            <p id="categorieInfo"></p>

            <input type="text" name="categorienaam" className="form-control" placeholder="Categorienaam" />
            <input type="file" name="omslagfoto" />
            <button type="submit" className="btn btn-info" id="categorieSubmit">
              Categorie aanmaken
            </button>
          </div>
        </form>
      </div>

      <script src="/js/admin/fotos/categorie_toevoegen.js"></script>
    </Layout>
  );
}

module.exports = CategorieToevoegen;
