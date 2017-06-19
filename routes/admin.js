const express = require('express');
const config = require('../lib/config');
const router = express.Router();
const helper = require('../lib/helpers');

/**
 * Admin page
 */
router.get('/', (req, res, next) => {
    if (!req.session.user || !helper.isAdmin(req.session.user)) {
        return next({
            message: config.ERR_PAGE_MESSAGES[403],
            status: 403
        });
    }

    const title = 'Admin';
    const props = {
        user : helper.userAdminRoles(req.session.user),
        title
    };

    res.render('app', {
        title,
        alerts: req.alerts,
        referral: req.session.referral,
        page: 'admin',
        props: JSON.stringify(props)
    });
});

/**
 * Convienence route to send session token when developing.
 */
if (!config.DEV) {
    router.get('/token', (req, res, next) => {
        if(!req.session.user || req.session.user.rank < 1) {
            return res.send({});
        }

        return res.send(req.session.token);
    });
}

module.exports = router;
