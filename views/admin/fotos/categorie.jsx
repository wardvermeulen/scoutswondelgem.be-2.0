var React = require("react");
var Layout = require("../../layout");

function Categorie(props) {
  const albums = props.albums.map(function (value, index) {
    return (
      <div key={index}>
        <p>
          <a href={value.categorie + "/" + value.naam}>{value.naam}</a> | {value.volgorde}
        </p>
        <img src={value.omslagfoto} />
      </div>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <div>{albums}</div>
      </div>
    </Layout>
  );
}

module.exports = Categorie;
