var React = require("react");

var Layout = require("./../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <div className="col-12-col-sm-10 col-md-8 col-lg-6 col-xl-5 card">
          <form method="POST" id="login" className="card-body">
            <h3>
              Aanmelden
              <img
                src="/svg/info.svg"
                className="ml-1"
                data-toggle="tooltip"
                data-placement="top"
                title="Aanmelden is strikt bedoeld voor de leidingsploeg en onze vzw."
              />
            </h3>

            <div id="loginInfo" className="my-2"></div>

            {/* Email input */}
            <div className="form-group mt-3">
              <input type="email" className="form-control" name="email" placeholder="Email" required />
            </div>

            {/* Wachtwoord input */}
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="wachtwoord"
                name="wachtwoord"
                placeholder="Wachtwoord"
                required
              />
            </div>

            <div className="custom-control custom-checkbox my-2">
              <input type="checkbox" className="custom-control-input" name="aangemeldBlijven" id="aangemeldBlijven" />
              <label htmlFor="aangemeldBlijven" className="custom-control-label">
                Aangemeld blijven
              </label>
            </div>

            {/* Wachtwoord vergeten */}
            <div className="form-group">
              <a href="/aanmelden/wachtwoord_vergeten">Wachtwoord vergeten?</a>
            </div>

            {/* Aanmeld knop */}
            <div className="form-group">
              <input type="submit" className="btn btn-primary" id="submit" value="Aanmelden" />
            </div>
          </form>
        </div>
      </div>

      <script src="/js/aanmelden.js"></script>
    </Layout>
  );
}

module.exports = Index;
