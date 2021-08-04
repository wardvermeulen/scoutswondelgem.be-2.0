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
            <form method="POST" id="bewerken">
              <div className="form-group">
                <label htmlFor="formGSM" className="ml-3">
                  GSM-nummer (formaat: 04XX/XX.XX.XX)
                </label>
                <input
                  type="tel"
                  name="gsm"
                  id="formGSM"
                  className="form-control"
                  placeholder="GSM-nummer"
                  defaultValue={props.gebruiker.gsm == null ? "" : props.gebruiker.gsm}
                />
              </div>
            </form>
            <form method="POST" encType="multipart/form-data" id="profielfoto">
              <img src={props.gebruiker.afbeelding} id="profielfotoImg" className="img-fluid" />
              <p id="profielfotoInfo"></p>
              <button type="submit" className="btn btn-info mr-3">
                Uploaden
              </button>
              <input type="file" name="profielfoto" />
            </form>
          </div>
        </div>
      </div>
      <script src="/js/admin/account/profielfoto.js"></script>
    </Layout>
  );
}

module.exports = Index;
