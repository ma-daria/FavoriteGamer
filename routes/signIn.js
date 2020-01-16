const express = require('express');
const router = express.Router();




const inquiry_user = require('../database/inquiry/inquiry_user');

router.post('/', async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    res.end (await inquiry_user.SignIn(email, password));
});





module.exports = router;
