const express = require('express');

const router = express.Router();
const srcFavorite = require('../src/srcFavorite');

/**
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
router.get('/', async (req, res) => {
  const cookie = req.cookies.user;
  let json;

  if (!srcFavorite.CheckCookie(cookie)) {
    json = { status: 'no login' };
    res.json(json);

    return;
  }

  json = await srcFavorite.GetInformationFavorite(cookie);
  res.json(json);
});

module.exports = router;
