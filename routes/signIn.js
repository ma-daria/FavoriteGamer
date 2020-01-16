const express = require('express');
const router = express.Router();




const src_user = require('../src/src_user');

router.get('/', async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let token = await src_user.SignIn(email, password);
    let json = {};
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
        // res.end('ok')
    }
    res.end(JSON.stringify(json));
    // res.end (token);
});





module.exports = router;
