const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');


const inquiry_user = require('../database/inquiry/inquiry_user');

router.post('/', async function(req, res) {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('multipart') === 0) {
        const form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
            let json = {};
            if (err) {
                console.error(err);
                json = {
                    'status': 'no ok'
                };
                // res.end('no ok')
            } else {
                let result = await inquiry_user.SignUp(fields, files);
                if (result !== 'no ok') {
                    res.cookie('user', result);
                    json = {
                        'status': 'ok'
                    };
                    // res.end('ok');
                }else {
                    res.cookie('user', undefined);
                    json = {
                        'status': 'no ok'
                    };
                }

                // res.end(result);
            }
            res.end(JSON.stringify(json));
        });
    }
});





module.exports = router;
