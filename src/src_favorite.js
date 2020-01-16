const request = require('request-promise');
const user = require('../database/models/user');
const favorite = require('../database/models/favorite');

/**
 * @return {boolean}
 */
function CheckCookie(cookie) {
    return cookie !== undefined;

}

async function CheckGamer(gamer) {
    let json;
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
    console.log(typeof json);
    return json;
}

/**
 * @return {boolean}
 */
async function AddFavorite(token, gamer){
    let id = await GetIdUser(token);

    await favorite.create({
        user_id: id,
        nickname_gamer: gamer
    })
        .catch(async (err) => {
            console.log(err);
            return false;
        });
    return true;
}

async function GetIdUser(token){
    let user_bd = await user.findOne({
        where: {
            token: token
        }
    })
        .catch((err) => {
            console.log(err)
        });
    return user_bd.dataValues.id;
}


module.exports.CheckCookie = CheckCookie;
module.exports.CheckGamer = CheckGamer;
module.exports.AddFavorite = AddFavorite;