var React = require("react");

var Layout = require("./../../layout");

function Gebruikers(props) {
  const users = props.users.map(function (value, index) {
    return (
      <tr key={index}>
        <th>{value.naam}</th>
        <td>{value.email}</td>
        <td>{value.tak}</td>
        <td className="text-right">
          <a href={"./gebruikers/bewerken/" + value.id}>
            <button className="btn btn-info btn-sm mr-2">Bewerken</button>
          </a>
          <a href={"./gebruikers/verwijderen/" + value.id}>
            <button className="btn btn-danger btn-sm mr-2">Verwijderen</button>
          </a>
        </td>
      </tr>
    );
  });

  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.title}</h1>
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Naam</th>
                <th>Emailadres</th>
                <th>Tak</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{users}</tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

module.exports = Gebruikers;
