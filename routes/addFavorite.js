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
  let json;

  if (!srcFavorite.CheckCookie(cookie)) {
    json = { status: 'no login' };
    res.json(json);

    return;
  }

  const schema = joi.object().keys({
    gamer: joi.string(),
  });
  const data = joi.validate(req.body, schema);

  if (data.error !== null) {
    json = { status: 'incorrect data' };
    console.log(data.error);

    res.json(json);
  } else {
    const { gamer } = req.body;

    let result;

    try {
      result = await srcFavorite.AddFavorite(cookie, gamer);
    } catch (e) {
      result = e;
    }

    json = { status: result };

    res.json(json);
  }
});

module.exports = router;
