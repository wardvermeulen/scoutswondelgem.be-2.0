var React = require("react");
var Layout = require("./../../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
      </div>
    </Layout>
  );
}

module.exports = Index;
