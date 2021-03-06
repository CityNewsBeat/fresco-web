const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const { user } = req.session;

    // TODO is this the correct permission
    if (user.roles.includes('admin')) {
        res.render('app', {
            title: 'Moderation',
            alerts: req.alerts,
            referral: req.session.referral,
            page: 'moderation',
            props: JSON.stringify({ user }),
        });
    } else {
        next({
            message: 'Not authorized to moderate content.',
            status: 401,
        });
    }
});

module.exports = router;
