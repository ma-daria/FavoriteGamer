const express = require('express');
const joi = require('joi');
const router = express.Router();
const src_user = require('../src/src_user');

/**
роут для входа в систему
на вход - json вида:
{
  "email": "2234",
  "password": "1"
}
на выход - json вида:
{
    "status": "true\false"
}
 */
router.get('/', async function(req, res) {
    const schema = joi.object().keys({
        email: joi.string(),
        password: joi.string()
    });
    const result = joi.validate(req.body, schema);
    if (result.error !== null) {
        res.end('{status: "false"}');
        console.log(result.error);
    }
    else {
        let email = req.body.email;
        let password = req.body.password;
        let token = await src_user.SignIn(email, password);
        let json;
        if (token === 'no ok') {
            res.clearCookie("user");
            json = {
                'status': 'false'
            };
        } else {
            res.cookie('user', token);
            json = {
                'status': 'true'
            };
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(json));
    }
});


module.exports = router;
