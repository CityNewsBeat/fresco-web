var express   = require('express'),
  router      = express.Router(),
  requestJson = require('request-json'),
  config      = require('../lib/config'),
  head        = require('../lib/head'),
  api         = requestJson.createClient(config.API_URL)

/**
 * Main highlights page
 */

router.get('/', (req, res, next) => {

    const title = 'Highlights';
    const props = {
        user : req.session.user,
        title: title
    };

    console.log('Highlights');

    res.render('app', {
        alerts: req.alerts,
        page : 'highlights',
        title : title,
        props : JSON.stringify(props)
    });
});

module.exports = router;