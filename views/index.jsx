var React = require("react");

var Layout = require("./layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container">
        <h1>{props.title}</h1>
        <p>Welcom to {props.title}</p>
      </div>
    </Layout>
  );
}

module.exports = Index;
