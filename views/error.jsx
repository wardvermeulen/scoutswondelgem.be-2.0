var React = require("react");

var Layout = require("./layout");

function Error(props) {
  return (
    <Layout {...props}>
      <div className="container">
        <h1 className="mt-3">Error {props.message}</h1>
        <pre>{props.error.stack}</pre>
      </div>
    </Layout>
  );
}

module.exports = Error;
