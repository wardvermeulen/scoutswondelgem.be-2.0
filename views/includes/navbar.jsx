var React = require("react");

function NavLink(props) {
  if (props.links) {
    const links = [];

    props.links.forEach((link) => {
      links.push(
        <a href={"/" + props.naam.toLowerCase() + "/" + link} className="dropdown-item">
          {link}
        </a>
      );
    });

    return (
      <li id={"navbar" + props.naam} className="nav-item dropdown">
        <a
          href="#"
          id={"toggle" + props.naam}
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          className="nav-link dropdown-toggle"
        >
          {props.naam}
        </a>
        <div className="dropdown-menu" aria-labelledby={"toggle" + props.naam}>
          {links}
        </div>
      </li>
    );
  } else {
    return (
      <a id={"navbar" + props.naam} href={"/" + props.naam.toLowerCase()} className="nav-item nav-link">
        {props.naam}
      </a>
    );
  }
}

function Navbar(props) {
  const navLinksLeft = [];
  const navLinksRight = [];
  let navContent;

  if (props.navbar) {
    props.navbar.left.forEach((element) => {
      navLinksLeft.push(<NavLink links={element.links} naam={element.naam}></NavLink>);
    });

    props.navbar.right.forEach((element) => {
      navLinksRight.push(<NavLink links={element.links} naam={element.naam}></NavLink>);
    });

    navContent = (
      <div id="navbarNavAltMarkup" className="collapse navbar-collapse">
        <div className="navbar-nav">{navLinksLeft}</div>
        <div className="navbar-nav ml-auto">{navLinksRight}</div>
      </div>
    );
  } else {
    navContent = (
      <div id="navbarNavAltMarkup" className="collapse navbar-collapse">
        <li>
          <span className="text-danger">Er was een probleem met het inladen van de navigatiebar.</span>
        </li>
      </div>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div id="navbar-container" className="container">
        {/* Home knop */}
        <a href="/" className="navbar-brand abs">
          Scouts Wondelgem
        </a>

        {/* Knop die verschijnt bij kleine schermen */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Herin staat de content van de navbar */}
        {navContent}
      </div>
    </nav>
  );
}

module.exports = Navbar;
