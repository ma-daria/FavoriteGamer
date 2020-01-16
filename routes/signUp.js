const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');


const src_user = require('../src/src_user');

router.post('/', async function(req, res) {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('multipart') === 0) {
        const form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
            let json = {};
            if (err) {
                console.error(err);
                json = {
                    'status': 'false'
                };
                // res.end('no ok')
            } else {
                let result = await src_user.SignUp(fields, files);
                if (result !== 'no ok') {
                    res.cookie('user', result);
                    json = {
                        'status': 'true'
                    };
                    // res.end('ok');
                }else {
                    res.clearCookie("user");
                    json = {
                        'status': 'false'
                    };
                }

                // res.end(result);
            }
            res.end(JSON.stringify(json));
        });
    }
});





module.exports = router;
