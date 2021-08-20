var React = require("react");
var Layout = require("./../layout");

function Index(props) {
  const menu = props.toegangInfo.map(function (value, index) {
    if (value.menu_naam) {
      return (
        <a
          href={"/admin" + value.url}
          className="py-1 px-3 hover:bg-gray-100 hover:rounded-lg hover:shadow"
          key={index}
        >
          {value.menu_naam}
        </a>
      );
    }
  });

  return (
    <Layout {...props}>
      <div className="max-w-5xl mx-auto flex flex-wrap space-x-5 space-y-5">
        <div className="flex flex-col w-screen sm:w-72 mx-4 sm:mx-0 space-y-1 px-5 py-4 border rounded-lg">{menu}</div>

        <div className="">
          <h1>{props.title}</h1>
        </div>
      </div>
    </Layout>
  );
}

module.exports = Index;
