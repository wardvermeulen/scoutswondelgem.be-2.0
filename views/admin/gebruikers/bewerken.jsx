var React = require("react");

var Layout = require("./../../layout");

function Bewerken(props) {
  return (
    <Layout {...props}>
      <div className="container col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div className="card m-3">
          <form method="POST" id="bewerken" className="card-body">
            <span>
              <h3>
                <span>
                  Gebruiker bewerken
                  <a href="/admin/gebruikers" className="btn btn-dark btn-sm float-right">
                    Keer terug
                  </a>
                </span>
              </h3>
            </span>

            <div className="form-group">
              <label htmlFor="formNaam" className="ml-3">
                Voornaam Achternaam<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="naam"
                id="formNaam"
                className="form-control"
                placeholder="Voornaam Achternaam"
                defaultValue={props.gebruiker.naam}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="formMail" className="ml-3">
                Emailadres<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="formMail"
                className="form-control"
                placeholder="Emailadres"
                defaultValue={props.gebruiker.email}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="formWachtwoord" className="ml-3">
                Nieuw wachtwoord
              </label>
              <input
                type="password"
                name="wachtwoord"
                id="formWachtwoord"
                className="form-control"
                placeholder="Laat leeg om niet aan te passen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="formGSM" className="ml-3">
                GSM-nummer (formaat: 04XX/XX.XX.XX)
              </label>
              <input type="tel" name="gsm" id="formGSM" className="form-control" placeholder="GSM-nummer" />
            </div>

            <div className="form-group">
              <label htmlFor="formTak" className="ml-3">
                Tak
              </label>
              <select name="tak" id="formTak" className="custom-select">
                <option value="Geen" className="font-weight-bold">
                  Geen
                </option>
                {props.takken.map(function (value, index) {
                  if (value.naam == props.gebruiker.tak) {
                    return (
                      <option key={index} value={value.naam} className="font-italic" selected>
                        {value.naam}
                      </option>
                    );
                  }
                  return (
                    <option key={index} value={value.naam}>
                      {value.naam}
                    </option>
                  );
                })}
                <option value={props.gebruiker.tak}>{props.gebruiker.tak}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="formRollen" className="ml-3">
                Rollen
              </label>
              <fieldset id="formRollen" className="card px-4 py-3">
                {props.rollen.map(function (value, index) {
                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        name="rollen"
                        id={"rol" + value.naam}
                        value={value}
                        defaultChecked={props.gebruiker.rollen.includes(value.naam) ? true : false}
                      />
                      <label htmlFor={"rol" + value.naam} className="ml-1">
                        {value.naam}
                      </label>
                    </div>
                  );
                })}
              </fieldset>
            </div>

            <div className="form-group">
              <input type="submit" value="Opslaan" className="btn btn-primary" />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

module.exports = Bewerken;
