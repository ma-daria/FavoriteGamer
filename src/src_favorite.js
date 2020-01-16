const request = require('request-promise');
var cheerio = require('cheerio');
const user = require('../database/models/user');
const favorite = require('../database/models/favorite');

/**
 * @return {boolean}
 */
function CheckCookie(cookie) {
    return cookie !== undefined;

}

async function ParsingSite(gamer){
    let url = process.env.PR_URL+gamer;
    return await request(url);
}

async function CheckGamer(gamer) {
    let json;
    const body = await ParsingSite(gamer);
    // let url = process.env.PR_URL+gamer;
    // const body = await request(url);
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


async function GetFavorite(token){
    let id = await GetIdUser(token);
    let favorite_g = await favorite.findAll({
        where: {
            user_id: id
        }
    })
        .catch((err) => {
            console.log(err)
        });
    return favorite_g.map((o) => o.dataValues.nickname_gamer);
}

/**
 * @return {string}
 */
async function GetInformationFavorite(token){
    let gamers = await GetFavorite(token);
    // let result = {''}
    let mas = [];
    for (let gamer of gamers) {
        let ga = await GetInformationGamer(gamer);
        mas.push(ga);
    }
    return  {"gamer": mas};
}

/**
 * @return {string}
 */
async function GetInformationGamer(gamer){
    const body = await ParsingSite(gamer);

    let $ = cheerio.load(body);

    let level = $('div.u-vertical-center').text();
    level = level.slice(0, level.length/2);
    let photo = $('img.player-portrait').attr("src");

    return {
        "nickname": gamer,
        "lavel": level,
        "photo": photo
    };
}




module.exports.CheckCookie = CheckCookie;
module.exports.CheckGamer = CheckGamer;
module.exports.AddFavorite = AddFavorite;
module.exports.GetInformationFavorite = GetInformationFavorite;
