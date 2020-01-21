const express = require('express');
const joi = require('joi');

const router = express.Router();
const srcFavorite = require('../src/srcFavorite');

/**
роут для проверки сущестования играков по нику
на вход - в query передается параметр gamer:
api/gamer_search?gamer=nikname

на выход - json вида:
{
    status: "true\false\no login"
}
 */
router.get('/', async (req, res) => {
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
  const data = joi.validate(req.query, schema);

  if (data.error !== null) {
    json = { status: 'incorrect data' };
    console.log(data.error);
    res.json(json);
  } else {
    const { gamer } = req.query;

    try {
      json = await srcFavorite.CheckGamer(gamer);
    } catch (e) {
      json = { status: e };
    }

    res.json(json);
  }
});

module.exports = router;
