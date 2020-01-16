const request = require('request-promise');

/**
 * @return {boolean}
 */
function CheckCookie(cookie) {
    if (cookie === undefined){
        return false;
    }
    return true;
}

async function CheckGamer(gamer) {
    let json = {};
    let url = process.env.PR_URL+gamer;
    const body = await request(url);
    if (body.indexOf('Профиль не найден') === -1){
        json = {
            'status': 'true'
        };
    }else {
        json = {
            'status': 'false'
        };
    }

    // const res = await new Promise(function(resolve, reject) {
    //     request(url, function (err, res, body) {
    //         if (err) reject(err);
    //         if (body.indexOf('Профиль не найден') === -1){
    //             json = {
    //                 'status': 'true'
    //             };
    //         }else {
    //             json = {
    //                 'status': 'false'
    //             };
    //         }
    //         resolve(json);
    //
    //     });
    // });
    console.log(typeof json);
    return json;
}



module.exports.CheckCookie = CheckCookie;
module.exports.CheckGamer = CheckGamer;