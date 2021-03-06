const express         = require('express');
const superagent      = require('superagent');
const config          = require('../../lib/config');
const validator       = require('validator');
const router          = express.Router();
const xml2js          = require("xml2js").parseString;
const mandrill        = require('mandrill-api/mandrill');
const mandrill_client = new mandrill.Mandrill(config.MANDRILL);


/**
 * Adds a pro user as a lead into zoho
 */
router.post('/signup', (req, res, next) => {
    let params = {
        firstname : req.body.firstname,
        lastname  : req.body.lastname,
        zip       : req.body.zip,
        phone     : req.body.phone.replace(/\D/g,''),
        email     : req.body.email,
        time      : req.body.time,
        adid      : typeof(req.body.adid) === 'undefined' ? '' : req.body.adid,
        market    : typeof(req.body.market) === 'undefined' ? '' : req.body.market,
        referral  : typeof(req.body.ref) === 'undefined' ?  '' : req.body.ref
    };

    /*
    Check fields
     */
    if(!params.firstname || !params.lastname || !params.time){
        return res.json({
            err: 'ERR_INVALID_PARAMETERS',
            success: false
        }).end();
    } else if(!validator.isNumeric(params.phone)){
        return res.json({
            err: 'ERR_INVALID_PHONE',
            success: false
        }).end();
    } else if(!validator.isEmail(params.email)){
        return res.json({
            err: 'ERR_INVALID_EMAIL',
            data: {}
        }).end();
    } else if(!validator.isNumeric(params.zip)){
        return res.json({
            err: 'ERR_INVALID_ZIP',
            success: false
        }).end();
    }

    //Make the XML Data
    let proUser =
        '<CustomModule1>' +
            '<row no="1">' +
                '<FL val="CustomModule1 Name">'+ params.firstname + ' ' + params.lastname + '</FL>' +
                '<FL val="First Name">' + params.firstname + '</FL>' +
                '<FL val="Last Name">' + params.lastname + '</FL>' +
                '<FL val="Email">' + params.email + '</FL>' +
                '<FL val="Zip Code">' + params.zip + '</FL>' +
                '<FL val="Phone Number">' + params.phone + '</FL>' +
                '<FL val="Best Time To Call">' + params.time + '</FL>' +
                '<FL val="Facebook Ad ID">' + params.adid + '</FL>' +
                '<FL val="AD Market">' + params.market + '</FL>' +
                '<FL val="Content Manager">' + params.referral + '</FL>' +
            '</row>' +
        '</CustomModule1>';

    //Send request to ZOHO
    superagent
    .post(config.ZOHO.CREATE_LEAD + '&xmlData=' + proUser)
    .end((err, response) => {

        //Response comes back as XML, we `indexOf` for the success message inside
        if(err || response.text.indexOf('Record(s) added successfully') == -1) {
             return res.json({
                err: 'ERR_FAILED',
                success: false
            }).end();
        } else{

            var rowId;

            xml2js(response.text, function (err, result) {
                var field = result.response.result[0].recorddetail[0]['FL'][0];

                //Check if field key is correct
                if(field['$']['val'] == 'Id'){
                    rowId = field['_'];
                }

                params.proId = rowId;

                sendEmail(params, null);

                //Respond with row id after parsing
                return res.json({
                    err: null,
                    success: true,
                    rowId: rowId
                }).end();
            });
        }
    });
});

/**
 * Sends response email to the pro user
 */
function sendEmail(params, callback) {
    mandrill_client.messages.sendTemplate({
        template_name: 'notification-prouser-signup',
        template_content: [],
        message: {
            from_email: "donotreply@fresconews.com",
            from_name: 'Fresco News',
            to: [{
                email: params.email
            }],
            merge_language: 'handlebars',
            global_merge_vars: [
                {
                    name: 'name',
                    content: 'Name - ' + params.firstname + ' ' + params.lastname
                },
                {
                    name: 'zip',
                    content: 'Zip Code - ' + params.zip
                },
                {
                    name: 'email',
                    content: 'Email - ' + params.email
                },
                {
                    name: 'phone',
                    content: 'Phone Number - ' + params.phone
                },
                {
                    name: 'time',
                    content: 'Best Time to Call - ' + params.time
                },
                {
                    name: 'link',
                    content: config.WEB_ROOT +'/pro/' + params.proId
                }
            ]
        }
    }, (response) => {
        var response = response[0];

        //Callback for success or failure
        if(response.status === 'sent')
            if(callback) callback(true)
        else
            if(callback) callback(false);
    });
}

/**
 * Updates a pro user on zoho
 */
router.post('/update', (req, res, next) => {
    var params = {
            day     : req.body.day,
            morning : req.body.morning == 'true', //BOOL gets converted to a string afterwards :(
            evening : req.body.evening == 'true',
            id      : req.body.id,
            time    : ''
        };

    if(params.morning && params.evening)
        params.time = config.PRO.MORNING + ' and ' + config.PRO.EVENING;
    else if(params.morning)
        params.time = config.PRO.MORNING
    else if(params.evening)
        params.time = config.PRO.EVENING
    else
        params.time = 'None';

    if(!params.day || !params.time || !params.id){
        return res.json({
            err: 'ERR_INVALID_PARAMETERS',
            success: false
        }).end();
    }

    //Make the XML Data
    var proUser =
        '<CustomModule1>' +
            '<row no="1">' +
                '<FL val="'+ params.day +'">' + params.time + '</FL>' +
            '</row>' +
        '</CustomModule1>';

    //Send request to ZOHO
    superagent
    .post(config.ZOHO.UPDATE_LEAD + '&id=' + params.id + '&xmlData=' + proUser)
    .end((err, response) => {
        console.log(response.text);

        //Response comes back as XML, we `indexOf` for the success message inside
        if(err || response.text.indexOf('Record(s) updated successfully') == -1) {
             return res.json({
                err: 'ERR_FAILED',
                success: false
            }).end();
        } else{
            return res.json({
                err: null,
                success: true
            }).end();
        }
    });

});

module.exports = router;
