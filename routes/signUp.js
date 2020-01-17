const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');


const src_user = require('../src/src_user');

router.post('/', async function(req, res) {
    const contentType = req.headers['content-type'];
    // res.writeHead(200, {'Content-Type': 'application/json'});
    if (contentType && contentType.indexOf('multipart') === 0) {
        const form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
            let json;
            if (err) {
                console.error(err);
                json = {
                    'status': 'false'
                };
            } else {
                // console.log(typeof files.avatar["0"].path);
                console.log(path.extname(files.avatar["0"].path));
                let result = await src_user.SignUp(fields, files);
                if (result !== 'no ok') {
                    res.cookie('user', result);
                    json = {
                        'status': 'true'
                    };
                }else {
                    res.clearCookie("user");
                    json = {
                        'status': 'false'
                    };
                }

            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(json));

        });
    }
});





module.exports = router;
