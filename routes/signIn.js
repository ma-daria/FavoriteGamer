const express = require('express');
const router = express.Router();




const inquiry_user = require('../database/inquiry/inquiry_user');

router.get('/', async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let token = await inquiry_user.SignIn(email, password);
    if (token !== 'no ok') {
        res.cookie('user', token);
        res.end('ok')
    }
    res.end (token);
});





module.exports = router;
