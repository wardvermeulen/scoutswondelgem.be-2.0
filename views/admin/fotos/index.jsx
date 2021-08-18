var React = require("react");
var Layout = require("./../../layout");

function Index(props) {
  const categorieen = props.categorieen.map(function (value, index) {
    return (
      <div key={index}>
        <p>
          <a href={"fotos/" + value.naam}>{value.naam}</a> | {value.volgorde}
        </p>
        <img src={value.omslagfoto} />
      </div>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <div>
          <a href="fotos/categorie_toevoegen">Categorie toevoegen</a>
        </div>
        <div>{categorieen}</div>
      </div>
    </Layout>
  );
}

module.exports = Index;
