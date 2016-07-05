const express = require('express');
const config = require('../lib/config');
const Purchases = require('../lib/purchases');
const router = express.Router();
const api = require('../lib/api');

/** //

    Description : Outlet Specific Routes ~ prefix /outlet/endpoint

// **/

/**
    * Outlet page for currently logged in user
*/

router.get('/', (req, res, next) => {
    let user;
    let token;
    if (req.session) {
        token = req.session.token;
        user = req.session.user;
    }

    if (!user.outlet) return res.redirect(config.DASH_HOME);

    return api.request({
        url: '/outlet/',
        token,
    }).then(response => {
        let purchases = null;

        if (user.outlet.verified) {
            purchases = Purchases.mapPurchases();
        } else {
            req.alerts.push(user.id === user.outlet.owner
                            ? 'This outlet is in demo mode. We’ll be in touch shortly to verify your account.'
                            : 'This outlet is in demo mode. Purchases and downloads are currently disabled.');
        }

        const title = 'Outlet';
        const props = {
            title,
            user,
            outlet: response.body,
            purchases,
        };

        return res.render('app', {
            title,
            alerts: req.alerts,
            props: JSON.stringify(props),
            page: 'outlet',
        });
    }).catch(() => (
        next({
            message: 'Outlet not found!',
            status: 404,
        })
    ));
});

/**
    *  Outlet settings page for current logged in user
*/

router.get('/settings', (req, res, next) => {
    let user;
    let token;
    if (req.session) {
        token = req.session.token;
        user = req.session.user;
    }

    if (!user.outlet) {
        const err = new Error('No outlet found!');
        err.status = 500;
        return next(err);
    }

    return api.request({
        url: '/outlet/',
        token,
    }).then(response => {
        const title = 'Outlet Settings';
        const props = {
            title,
            user,
            outlet: response.body,
            stripePublishableKey: config.STRIPE_PUBLISHABLE,
        };

        return res.render('app', {
            title,
            page: 'outletSettings',
            alerts: req.alerts,
            remoteScripts: ['https://js.stripe.com/v2/'],
            props: JSON.stringify(props),
        });
    }).catch(() => (
        next({
            message: 'Outlet not found!',
            status: 404,
        })
    ));
});

module.exports = router;
