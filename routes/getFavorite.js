const express = require('express');
const router = express.Router();
const src_favorite = require('../src/src_favorite');

/*
роут для получения списка избранных играков
на выход - json вида:
{
    "gamer": [
        {
            "nickname": "nickname",
            "lavel": "lavel",
            "photo": "url photo"
        },
        ...
    ]
}
 */
router.get('/', async function(req, res) {
    let cookie = req.cookies.user;
    if(!src_favorite.CheckCookie(cookie)){
        res.end('{status: "no login"}');
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(await src_favorite.GetInformationFavorite(cookie)));
});

module.exports = router;
