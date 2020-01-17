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

  if (!srcFavorite.CheckCookie(cookie)) {
    res.end('{status: "no login"}');
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(await srcFavorite.GetInformationFavorite(cookie)));
});

module.exports = router;
