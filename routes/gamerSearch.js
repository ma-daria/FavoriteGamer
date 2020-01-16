const express = require('express');
const router = express.Router();
const src_favorite = require('../src/src_favorite');

router.get('/', async function(req, res) {
    let json = null;

    let cookie = req.cookies.user;
    if(!src_favorite.CheckCookie(cookie)){
        res.end('{status: "no login"}');
    }

    let gamer = req.body.gamer;
    const prom = await src_favorite.CheckGamer(gamer);

    res.end(JSON.stringify(prom));


});





module.exports = router;
