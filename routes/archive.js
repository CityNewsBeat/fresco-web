const express = require('express');
const config = require('../lib/config');
const router = express.Router();

/**
 * Index Content Page
 */
router.get('/', (req, res) => {
    const title = 'Archive';
    const props = { user: req.session.user, title };

    res.render('app', {
        title,
        page: 'archive',
        alerts: req.alerts,
        referral: req.session.referral,
        props: JSON.stringify(props),
    });
});

/**
 * Page for all galleries
 */
router.get('/galleries', (req, res) => {
    const title = 'Galleries';
    const props = { user: req.session.user, title };

    res.render('app', {
        user: req.session.user,
        title,
        config,
        alerts: req.alerts,
        referral: req.session.referral,
        page: 'galleries',
        props: JSON.stringify(props),
    });
});

/**
 * Page for all stories
 */
router.get('/stories', (req, res) => {
    const title = 'Stories';
    const props = { user: req.session.user };

    res.render('app', {
        title,
        config,
        alerts: req.alerts,
        referral: req.session.referral,
        page: 'stories',
        props: JSON.stringify(props),
    });
});

/**
 * Filters between photos or videos
 * @param {string} filter Filter of content type i.e. videos/photos
 */
router.get('/:filter', (req, res) => {
    const filters = ['photos', 'videos'];

    // Check if filter is valid
    if (filters.indexOf(req.params.filter.toLowerCase()) === -1) {
        return res.redirect('/');
    }

    const title = req.params.filter[0].toUpperCase() + req.params.filter.slice(1);
    const props = { user: req.session.user, title };

    return res.render('app', {
        title,
        page: req.params.filter,
        alerts: req.alerts,
        referral: req.session.referral,
        props: JSON.stringify(props),
    });
});

module.exports = router;
