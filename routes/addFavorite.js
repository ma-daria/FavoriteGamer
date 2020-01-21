const express = require('express');
const joi = require('joi');

const router = express.Router();
const srcFavorite = require('../src/srcFavorite');

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
router.post('/', async (req, res) => {
  const cookie = req.cookies.user;

  if (!srcFavorite.CheckCookie(cookie)) {
    res.end('{status: "no login"}');
  }

  const schema = joi.object().keys({
    gamer: joi.string(),
  });
  const data = joi.validate(req.body, schema);

  if (data.error !== null) {
    res.end('{status: "incorrect data"}');
    console.log(data.error);
  } else {
    const { gamer } = req.body;

    let result;

    try {
      result = await srcFavorite.AddFavorite(cookie, gamer);
    } catch (e) {
      result = e;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const json = { status: result };

    res.end(JSON.stringify(json));
  }
});

module.exports = router;
