const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async function(req, res) {
    let cookie = req.cookies.user;
    let json = {};

    console.log(cookie);
    if (cookie === undefined){
        json = {
            'status': 'no login'
        };
        res.end(JSON.stringify(json));
    }

    let gamer = req.body.gamer;
    let url = process.env.PR_URL+gamer;


    const prom = new Promise(function(resolve, reject) {
        request(url, function (err, res, body) {
            if (err) reject(err);
            if (body.indexOf('Профиль не найден') === -1){
                json = {
                    'status': 'true'
                };
            }else {
                json = {
                    'status': 'false'
                };
            }
            resolve(json);

        });
    });
    prom
        .then((data) => {
            res.end(JSON.stringify(data));
        })
        .catch((error) => {
            console.log(error);
        });


});





module.exports = router;
