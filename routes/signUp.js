const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');


const src_user = require('../src/src_user');

router.post('/', async function(req, res) {
    const contentType = req.headers['content-type'];
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
                let size;
                size = await src_user.GetSizeFile(files.avatar["0"].path);

                let result;
                if (((path.extname(files.avatar["0"].path) === '.jpg') || (path.extname(files.avatar["0"].path) === '.png')
                    || (path.extname(files.avatar["0"].path) === '.JPG') || (path.extname(files.avatar["0"].path) === '.PNG')
                    )&& (size <= 5242880))
                    result = await src_user.SignUp(fields, files);
                else
                    result = 'no ok';
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
