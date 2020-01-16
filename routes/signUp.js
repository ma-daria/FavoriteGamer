const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');


const inquiry_user = require('../database/inquiry/inquiry_user');

router.post('/', async function(req, res) {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('multipart') === 0) {
        const form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
            if (err) {
                console.error(err);
                res.end('no ok')
            } else {
                let result = await inquiry_user.SignUp(fields, files);
                if (result !== 'no ok') {
                    res.cookie('user', result);
                    res.end('ok');
                }
                res.end(result);
            }
        });
    }
});





module.exports = router;
