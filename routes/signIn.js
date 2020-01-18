const express = require('express');
const joi = require('joi');

const router = express.Router();
const srcUser = require('../src/srcUser');

/**
роут для входа в систему
на вход - json вида:
{
  "email": "2234",
  "password": "1"
}
на выход - json вида:
{
    "status": "true\false"
}
 */
router.post('/', async (req, res) => {
  const schema = joi.object().keys({
    email: joi.string(),
    password: joi.string(),
  });
  const result = joi.validate(req.body, schema);

  if (result.error !== null) {
    res.end('{status: "false"}');
    console.log(result.error);
  } else {
    const { email } = req.body;
    const { password } = req.body;
    const token = await srcUser.SignIn(email, password);
    let json;

    if (token === 'no ok') {
      res.clearCookie('user');
      json = {
        status: 'false',
      };
    } else {
      res.cookie('user', token);
      json = {
        status: 'true',
      };
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
  }
});

module.exports = router;
