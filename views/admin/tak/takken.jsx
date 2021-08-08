var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  const takken = props.takken.map(function (value, index) {
    return (
      <li key={index}>
        <a href={"/admin/tak/" + value.url_naam}>{value.naam}</a>
      </li>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>Takken</h1>
        <ol>{takken}</ol>
      </div>
    </Layout>
  );
}

module.exports = Index;
