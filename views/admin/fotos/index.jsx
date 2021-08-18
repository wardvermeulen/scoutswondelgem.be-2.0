var React = require("react");
var Layout = require("./../../layout");

function Index(props) {
  const albums = props.categorieen.map(function (value, index) {
    return (
      <div>
        <p key={index}>
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
        <div>{albums}</div>
      </div>
    </Layout>
  );
}

module.exports = Index;
