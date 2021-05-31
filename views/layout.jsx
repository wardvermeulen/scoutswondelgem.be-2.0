var React = require("react");

var Head = require("./includes/head");
var Navbar = require("./includes/navbar");
var Footer = require("./includes/footer");

function Layout(props) {
  return (
    <html>
      <Head title={props.title}></Head>
      <body>
        <Navbar navbar={props.navbar}></Navbar>
        {props.children}
        <Footer></Footer>
      </body>
    </html>
  );
}

module.exports = Layout;
