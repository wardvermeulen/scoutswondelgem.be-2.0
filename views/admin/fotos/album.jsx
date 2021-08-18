var React = require("react");
var Layout = require("../../layout");

function Album(props) {
  const fotos = props.fotos.map(function (value, index) {
    return (
      <div key={index}>
        <img src={value.foto} />
      </div>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <div>
          <a href={props.album.naam + "/fotos_toevoegen"}>Foto's toevoegen</a>
        </div>
        <div>{fotos}</div>
      </div>
    </Layout>
  );
}

module.exports = Album;
