var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  const maandbrieven = props.maandbrieven.map(function (maandbrief, index) {
    return (
      <tr key={index} id={maandbrief.bestandsnaam}>
        <td className="text-center">
          <input
            type="checkbox"
            className="weergeven"
            name={maandbrief.bestandsnaam}
            defaultChecked={maandbrief.weergeven ? true : false}
          />
        </td>
        <th>
          <a href={maandbrief.pad} target="_blank">
            {maandbrief.bestandsnaam}
          </a>
        </th>
        <td>{maandbrief.upload_datum}</td>
        <td className="text-right">
          <button className="verwijderen btn btn-danger btn-sm" name={maandbrief.bestandsnaam}>
            Verwijderen
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Layout {...props}>
      <div className="max-w-6xl mx-auto">
        <div className="mx-2 space-y-2">
          <h1>{props.tak.naam}</h1>

          <form method="POST" id="tekstje">
            <div className="form-group space-y-2">
              <p id="tekstjeInfo"></p>
              <label htmlFor="tekstjeEditor" className="text-justify">
                Dit is het tekstje van de tak dat bezoekers kunnen zien als ze naar de pagina van de tak gaan. Wees niet
                bang om dit ooit eens aan te passen, te personaliseren, etc.
              </label>
              <div id="tekstjeEditor"></div>
              <button type="submit" id="tekstjeSubmit" className="bg-sky-200 hover:bg-sky-300 rounded-lg px-3 py-2">
                Opslaan
              </button>
            </div>
          </form>

          <hr />

          <form method="POST" encType="multipart/form-data" id="maandbrief" className="space-y-2">
            <p>
              Hier kan je de maandbrieven uploaden (meerdere tegelijkertijd mogelijk). In de tabel kan je daarna
              aanduiden of je de brieven wilt tonen voor de bezoekers of niet, zo hoef je de maandbrieven niet altijd te
              verwijderen.
            </p>
            <p className="text-danger">
              Heel belangrijk: het is absoluut verboden om copyrighted materiaal in je maandbrieven te verwerken. Er
              zijn bedrijven die zich specialiseren in het zoeken van bestanden die afbeeldingen bevatten die
              copyrighted zijn. De boetes kunnen oplopen tot €10.000. Gebruik dus altijd sites waarvan je zeker bent dat
              je het materiaal mag gebruiken.
            </p>

            <div className="space-x-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded font-bold text-blue-500 hover:text-blue-600 focus-within:outline-none"
              >
                <span>Selecteer bestanden</span>
                <input id="file-upload" name="maandbrief" type="file" multiple className="sr-only" />
              </label>
              <button type="submit" className="bg-sky-200 hover:bg-sky-300 rounded-lg px-3 py-2" id="maandbriefSubmit">
                Uploaden
              </button>
            </div>
            <p id="maandbriefInfo" className="mt-3"></p>
          </form>

          <div className="table-responsive mt-3">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className="text-center">
                    Weergeven
                  </th>
                  <th scope="col">Bestandsnaam</th>
                  <th scope="col">Uploaddatum</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>{maandbrieven}</tbody>
            </table>
          </div>

          <hr />

          <form method="POST" id="email">
            <div className="form-group">
              <p id="emailInfo"></p>
              <label htmlFor="emailInput" className="ml-3">
                E-mailadres van de tak
              </label>
              <input type="text" id="emailInput" name="email" className="form-control" defaultValue={props.tak.email} />
              <button type="submit" id="emailSubmit">
                Opslaan
              </button>
            </div>
          </form>
        </div>
      </div>

      <script src="/js/admin/tak/tekstje.js"></script>
      <script src="/js/admin/tak/maandbrief.js"></script>
      <script src="/js/admin/tak/email.js"></script>
    </Layout>
  );
}

module.exports = Index;
