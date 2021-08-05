var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div className="card m-3">
          <div className="card-body">
            <h3>{props.gebruiker.naam}</h3>
            <p>
              Email: {props.gebruiker.email} <br />
              {props.gebruiker.tak && (
                <span>
                  Tak: {props.gebruiker.tak} <br />
                </span>
              )}
            </p>

            <form method="POST" id="info">
              <div className="form-group">
                <p id="infoInfo"></p>
                <label htmlFor="gsm" className="ml-3">
                  GSM-nummer (formaat: 04XX/XX.XX.XX)
                </label>
                <input
                  type="tel"
                  name="gsm"
                  id="gsm"
                  className="form-control"
                  placeholder="GSM-nummer"
                  defaultValue={props.gebruiker.gsm == null ? "" : props.gebruiker.gsm}
                />
                <button type="submit" id="infoSubmit">
                  Opslaan
                </button>
              </div>
            </form>

            <form method="POST" id="tekstje">
              <div className="form-group">
                <p id="tekstjeInfo"></p>
                <label htmlFor="tekstjeEditor" className="ml-3">
                  Persoonlijk tekstje
                </label>
                <div id="tekstjeEditor"></div>
                <button type="submit" id="tekstjeSubmit">
                  Opslaan
                </button>
              </div>
            </form>

            <form method="POST" id="wachtwoord">
              <div className="form-group">
                <p id="wachtwoordInfo"></p>
                <label htmlFor="oud" className="ml-3">
                  Wachtwoord wijzigen
                </label>
                <div>
                  <input type="password" className="form-control" name="oud" id="oud" placeholder="Oud wachtwoord" />
                  <input type="password" className="form-control mt-2" name="nieuw" placeholder="Nieuw wachtwoord" />
                  <input
                    type="password"
                    className="form-control mt-2"
                    name="nieuw2"
                    placeholder="Nieuw wachtwoord herhalen"
                  />
                </div>
                <input type="submit" value="Opslaan" id="wachtwoordSubmit" />
              </div>
            </form>

            <form method="POST" encType="multipart/form-data" id="profielfoto">
              <img
                src={props.gebruiker.afbeelding}
                id="profielfotoImg"
                className="img-fluid mb-3"
                hidden={props.gebruiker.afbeelding ? false : true}
              />
              <p id="profielfotoInfo"></p>
              <button type="submit" className="btn btn-info mr-3" id="profielfotoSubmit">
                Uploaden
              </button>
              <input type="file" name="profielfoto" />
            </form>
          </div>
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
