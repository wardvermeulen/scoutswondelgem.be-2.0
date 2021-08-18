var React = require("react");
var Layout = require("../../layout");

function Album(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <div>{props.categorie.naam}</div>
      </div>
    </Layout>
  );
}

module.exports = Album;
