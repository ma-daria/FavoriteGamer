const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');
const request = require('request');

router.post('/', function(req, res, next) {
    const contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('multipart') === 0) {
        const form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            if (!err) {
                const name = fields.name["0"];
                const surname = fields.surname["0"];
                const avatar = files.avatar["0"].path;
                const email = fields.email["0"];
                const password = fields.password["0"];
            }else{
                console.error(err);
            }
        });
    }
});

module.exports = router;
