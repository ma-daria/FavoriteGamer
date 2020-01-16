const express = require('express');
const router = express.Router();

router.post('/', async function(req, res) {
    let cookie = req.cookies.user;
    if(!src_favorite.CheckCookie(cookie)){
        res.end('{status: "no login"}');
    }

    let gamer = req.body.gamer;
});





module.exports = router;
