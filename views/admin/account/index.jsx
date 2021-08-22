var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col space-y-3 mx-4 sm:mx-0 px-5 py-4 border rounded-lg">
          <h3>{props.gebruiker.naam}</h3>
          <div className="flex flex-col space-y-1">
            <span>Email: {props.gebruiker.email}</span>
            {props.gebruiker.tak && (
              <span>
                Tak: {props.gebruiker.tak} <br />
              </span>
            )}
          </div>

          <hr />

          <form method="POST" encType="multipart/form-data" id="profielfoto">
            <p id="profielfotoInfo" className="hidden border-2 rounded p-3 mb-2"></p>
            <div className="flex">
              <img
                src={props.gebruiker.afbeelding}
                id="profielfotoImg"
                className="w-1/2 rounded"
                hidden={props.gebruiker.afbeelding ? false : true}
              />
              <div className="ml-2 space-y-2">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="relative justify-start cursor-pointer rounded font-medium text-blue-500 hover:text-blue-600 focus-within:outline-none"
                  >
                    <span>Upload een profielfoto</span>
                    <input id="file-upload" name="profielfoto" type="file" className="sr-only" />
                  </label>
                </div>
                <button type="submit" id="profielfotoSubmit" className="bg-sky-200 hover:bg-sky-300 px-3 py-2 rounded">
                  Opslaan
                </button>
              </div>
            </div>
          </form>

          <hr />

          <form method="POST" id="info">
            <div className="space-y-1">
              <p id="infoInfo" className="hidden border-2 rounded p-3 mb-2"></p>
              <label htmlFor="gsm" className="ml-3">
                GSM-nummer (formaat: 04XX/XX.XX.XX)
              </label>
              <input
                type="tel"
                name="gsm"
                id="gsm"
                className="w-full input"
                placeholder="GSM-nummer"
                defaultValue={props.gebruiker.gsm == null ? "" : props.gebruiker.gsm}
              />
              <button type="submit" id="infoSubmit" className="bg-sky-200 hover:bg-sky-300 px-3 py-2 rounded">
                Opslaan
              </button>
            </div>
          </form>

          <hr />

          <form method="POST" id="tekstje">
            <div className="form-group space-y-2">
              <p id="tekstjeInfo" className="hidden border-2 rounded p-3 mb-2"></p>
              <label htmlFor="tekstjeEditor" className="ml-3">
                Persoonlijk tekstje
              </label>
              <div id="tekstjeEditor"></div>
              <button type="submit" id="tekstjeSubmit" className="bg-sky-200 hover:bg-sky-300 px-3 py-2 rounded">
                Opslaan
              </button>
            </div>
          </form>

          <hr />

          <form method="POST" id="wachtwoord">
            <div className="form-group space-y-2">
              <p id="wachtwoordInfo" className="hidden border-2 rounded p-3 mb-2"></p>
              <label htmlFor="oud" className="ml-3">
                Wachtwoord wijzigen
              </label>
              <div className="space-y-1">
                <input type="password" className="w-full input" name="oud" id="oud" placeholder="Oud wachtwoord" />
                <input type="password" className="w-full input" name="nieuw" placeholder="Nieuw wachtwoord" />
                <input type="password" className="w-full input" name="nieuw2" placeholder="Nieuw wachtwoord herhalen" />
              </div>
              <button type="submit" id="wachtwoordSubmit" className="bg-sky-200 hover:bg-sky-300 px-3 py-2 rounded">
                Opslaan
              </button>
            </div>
          </form>
        </div>
      </div>

      <script src="/js/admin/account/info.js"></script>
      <script src="/js/admin/account/tekstje.js"></script>
      <script src="/js/admin/account/wachtwoord.js"></script>
      <script src="/js/admin/account/profielfoto.js"></script>
    </Layout>
  );
}

module.exports = Index;
