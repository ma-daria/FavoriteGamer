const express = require('express');

const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');
const srcUser = require('../src/srcUser');

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 8;

/**
 роут регистрации
 на вход - FormData вида:
 key         value
 name
 surname
 avatar
 email
 password
 на выход - json вида:
 {
    "status": "true\false"
}
 */
router.post('/', async (req, res) => {
  const contentType = req.headers['content-type'];
  let json;

  if (contentType && contentType.indexOf('multipart') === 0) {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      // let json;

      if (err) {
        console.error(err);
        json = {
          status: 'incorrect data',
        };
      } else {
        let size;

        try {
          size = await srcUser.GetSizeFile(files.avatar['0'].path);
        } catch (e) {
          console.log(e);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.clearCookie('user');
          json = {
            status: 'image error',
          };
          res.end(JSON.stringify(json));

          return;
        }
        let result;

        if (((path.extname(files.avatar['0'].path).toLowerCase() === '.jpg')
            || (path.extname(files.avatar['0'].path).toLowerCase() === '.png')
        ) && (size <= MAX_FILE_SIZE)) {
          try {
            result = await srcUser.SignUp(fields, files);
            res.cookie('user', result);
            json = {
              status: 'true',
            };
          } catch (e) {
            res.clearCookie('user');
            json = {
              status: e.name,
            };
          }
        } else {
          res.clearCookie('user');
          json = {
            status: 'image error',
          };
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(json));
    });
  } else {
    json = {
      status: 'incorrect data',
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
  }
});

module.exports = router;
