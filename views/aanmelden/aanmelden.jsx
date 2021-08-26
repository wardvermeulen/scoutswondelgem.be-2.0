var React = require("react");

var Layout = require("./../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="max-w-xl mx-auto">
        <form method="POST" id="login" className="mx-2 px-5 py-4 space-y-3 border-2 rounded-lg">
          <h3>Aanmelden</h3>

          <div id="loginInfo" className="hidden border-2 rounded p-3"></div>

          <div className="space-y-2">
            {/* Email input */}
            <input type="email" className="w-full input" name="email" placeholder="Email" required />

            {/* Wachtwoord input */}
            <input
              type="password"
              className="w-full input"
              id="wachtwoord"
              name="wachtwoord"
              placeholder="Wachtwoord"
              required
            />
          </div>

          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="form-checkbox rounded-full text-sky-500"
              name="aangemeldBlijven"
              id="aangemeldBlijven"
            />
            <label htmlFor="aangemeldBlijven" className="ml-1">
              Aangemeld blijven
            </label>
          </div>

          {/* Wachtwoord vergeten */}
          <div>
            <a
              href="/aanmelden/wachtwoord_vergeten"
              className="text-sky-500 hover:text-sky-600 hover:underline text-medium"
            >
              Wachtwoord vergeten?
            </a>
          </div>

          {/* Aanmeld knop */}
          <div>
            <button type="submit" className="text-sky-50 bg-sky-700 hover:bg-sky-800 rounded-lg px-3 py-2" id="submit">
              Aanmelden
            </button>
          </div>
        </form>
      </div>

      <script src="/js/aanmelden.js"></script>
    </Layout>
  );
}

module.exports = Index;
