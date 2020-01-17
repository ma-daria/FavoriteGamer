const express = require('express');
const router = express.Router();
const src_favorite = require('../src/src_favorite');

router.post('/', async function(req, res) {
    let cookie = req.cookies.user;
    if(!src_favorite.CheckCookie(cookie)){
        res.end('{status: "no login"}');
    }

    let gamer = req.body.gamer;
    let f =await src_favorite.AddFavorite(cookie, gamer);
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (f){
        res.end('{status: "true"}');
    }else
        res.end('{status: "false"}');
});





module.exports = router;
