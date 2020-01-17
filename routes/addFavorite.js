const express = require('express');
const joi = require('joi');
const router = express.Router();
const src_favorite = require('../src/src_favorite');


/**
 * роут для добавления игрока по нику в избранное.
 * на вход - json вида:
 * {
 *   "gamer": "nickname_gamer"
 * }
 * на выход - json вида:
 * {
 *    status: "true\false\no login"
 * }
 */
router.post('/', async function(req, res) {
    let cookie = req.cookies.user;
    if(!src_favorite.CheckCookie(cookie)){
        res.end('{status: "no login"}');
    }

    const schema = joi.object().keys({
        gamer: joi.string(),
    });
    const result = joi.validate(req.body, schema);

    if (result.error !== null) {
        res.end('{status: "false"}');
        console.log(result.error);
    }
    else {
        let gamer = req.body.gamer;
        let f = await src_favorite.AddFavorite(cookie, gamer);
        res.writeHead(200, {'Content-Type': 'application/json'});
        if (f) {
            res.end('{status: "true"}');
        } else
            res.end('{status: "false"}');
    }
});

module.exports = router;
