var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Takken',
    takken: {
      kapoenen: {
        naam: 'Kapoenen'
      },
      kabouters: {
        naam: 'Kabouters'
      },
      welpen: {
        naam: 'Welpen'
      },
      jonggidsen: {
        naam: 'Jonggidsen,'
      },
      jongverkenners: {
        naam: 'Jongverkenners'
      },
      givers: {
        naam: 'Givers'
      },
      jin: {
        naam: 'Jin'
      },
      groepsleiding: {
        naam: 'Groepsleiding'
      },

    } 
  });
});

module.exports = router;
