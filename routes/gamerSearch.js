const express = require('express');
const joi = require('joi');

const router = express.Router();
const srcFavorite = require('../src/srcFavorite');

/**
роут для проверки сущестования играков по нику
на вход - json вида:
{
  "gamer": "nickname_gamer"
}
на выход - json вида:
{
    status: "true\false\no login"
}
 */
router.get('/', async (req, res) => {
  const cookie = req.cookies.user;

  if (!srcFavorite.CheckCookie(cookie)) {
    res.end('{status: "no login"}');
  }
  const schema = joi.object().keys({
    gamer: joi.string(),
  });
  const result = joi.validate(req.body, schema);

  if (result.error !== null) {
    res.end('{status: "false"}');
    console.log(result.error);
  } else {
    const { gamer } = req.body;
    const json = await srcFavorite.CheckGamer(gamer);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
  }
});

module.exports = router;
