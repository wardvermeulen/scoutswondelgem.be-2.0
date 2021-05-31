var { React, Component } = require("react");

class Navbar extends Component {
  render() {
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
        <div id="navbarNavAltMarkup" className="collapse navbar-collapse">
          {props.navbar && <div className="navbar-nav">test</div>}
        </div>
      </div>
    </nav>;
  }
}

module.exports = Navbar;
