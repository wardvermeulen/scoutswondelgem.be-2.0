var React = require("react");

var Layout = require("./../../layout");

function Gebruikers(props) {
  const users = props.users.map(function (value, index) {
    return (
      <tr key={index} className="hover:bg-gray-100">
        <th className="py-2 px-4">{value.naam}</th>
        <td className="px-4">{value.email}</td>
        <td className="px-4">{value.tak}</td>
        <td className="px-4">
          {value.rollen.map(function (value, index, array) {
            if (index == array.length - 1) return value;
            return value + ", ";
          })}
        </td>
        <td className="px-4 text-right">
          <a href={"./gebruikers/bewerken/" + value.id}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </a>
          <a href={"./gebruikers/verwijderen/" + value.id}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </a>
        </td>
      </tr>
    );
  });

  return (
    <Layout {...props}>
      <div className="max-w-6xl mx-auto">
        <div className="mx-2">
          <h1>{props.title}</h1>
          <div className="mt-3 rounded rounded-lg border-2 border-gray-300 overflow-x-auto">
            <table className="table-auto w-full text-left divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th className="py-4 px-4">Naam</th>
                  <th className="px-4">Emailadres</th>
                  <th className="px-4">Tak</th>
                  <th className="px-4">Rollen</th>
                  <th className="px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">{users}</tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

module.exports = Gebruikers;
