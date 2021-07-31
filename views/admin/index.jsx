var React = require("react");
var Layout = require("./../layout");

function Index(props) {
  const menu = props.rollenInfo.map(function (value, index) {
    return (
      <a href={"/admin" + value.url} className="dropdown-item" key={index}>
        {value.menu_naam}
      </a>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">{menu}</div>
            </div>
          </div>

          <div className="col-sm mt-3">
            <h1>{props.title}</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
}

module.exports = Index;
