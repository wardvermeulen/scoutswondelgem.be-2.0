var React = require("react");

var Layout = require("./../../layout");

function Index(props) {
  return (
    <Layout {...props}>
      <div className="container mt-3">
        <h1>{props.tak.naam}</h1>

        <form method="POST" id="tekstje">
          <div className="form-group">
            <p id="tekstjeInfo"></p>
            <label htmlFor="tekstjeEditor" className="ml-3">
              Dit is het tekstje van de tak dat bezoekers kunnen zien als ze naar de pagina van de tak gaan. Wees niet
              bang om dit ooit eens aan te passen, te personaliseren, etc.
            </label>
            <div id="tekstjeEditor"></div>
            <button type="submit" id="tekstjeSubmit">
              Opslaan
            </button>
          </div>
        </form>

        <hr />

        <form method="POST" encType="multipart/form-data" id="maanbrief">
          <p id="maandbriefInfo"></p>
          <p>
            Hier kan je de maandbrieven uploaden (meerdere tegelijkertijd mogelijk). In de tabel kan je daarna aanduiden
            of je de brieven wilt tonen voor de bezoekers of niet, zo hoef je de maandbrieven niet altijd te
            verwijderen.
          </p>

          <p className="text-danger">
            Heel belangrijk: het is absoluut verboden om copyrighted materiaal in je maandbrieven te verwerken. Er zijn
            bedrijven die zich specialiseren in het zoeken van bestanden die afbeeldingen bevatten die copyrighted zijn.
            De boetes kunnen oplopen tot €10.000. Gebruik dus altijd sites waarvan je zeker best dat je het materiaal
            mag gebruiken.
          </p>
          <button type="submit" className="btn btn-info mr-3" id="maandbriefSubmit">
            Uploaden
          </button>
          <input type="file" name="maandbrief" multiple />
        </form>
      </div>

      <script src="/js/admin/tak/tekstje.js"></script>
    </Layout>
  );
}

module.exports = Index;
