const request = require('request-promise');
var cheerio = require('cheerio');
const user = require('../database/models/user');
const favorite = require('../database/models/favorite');

/**
 * Проверка куки
 * @param cookie - куки
 * @returns {boolean} - результат проверки
 * @constructor
 */
function CheckCookie(cookie) {
    return cookie !== undefined;
}

/**
 * получение html старницы сайта
 * @param gamer никнейм играка
 * @returns {Promise<void>} - html страница
 * @constructor
 */
async function ParsingSite(gamer){
    let url = process.env.PR_URL+gamer;
    return await request(url);
}

/**
 * Проверка существования игрока
 * @param gamer - никнейм игрока
 * @returns {Promise<{status: string}|{status: string}>} json с результатом
 * @constructor
 */
async function CheckGamer(gamer) {
    let json;
    let body;
    try {
        body = await ParsingSite(gamer);
    } catch(e) {
        console.log(e);
        return {
            'status': 'false'
        };
    }

    if (body.indexOf('Профиль не найден') === -1){
        json = {
            'status': 'true'
        };
    }else {
        json = {
            'status': 'false'
        };
    }
    return json;
}

/**
 * Добваление в избранное
 * @param token токен пользователя
 * @param gamer никнейм игрока
 * @returns {Promise<boolean>} статус операции
 * @constructor
 */
async function AddFavorite(token, gamer){
    let id = await GetIdUser(token);

    let sherch = await favorite.findOne({
        where: {
            user_id: id,
            nickname_gamer: gamer
        }
    })
        .catch((err) => {
            console.log(err);
            return false;
        });

    if (sherch !== null)
        return true;

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

/**
 * Запрос id пользователя
 * @param token токен пользователя
 * @returns {Promise<*>} id
 * @constructor
 */
async function GetIdUser(token){
    let user_bd = await user.findOne({
        where: {
            token: token
        }
    })
        .catch((err) => {
            console.log(err);
            return -1;
        });
    return user_bd.dataValues.id;
}

/**
 * список играков в избранном
 * @param token токен пользователя
 * @returns {Promise<Uint8Array|BigInt64Array|any[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array>}
 *      json со списком никнеймов играков
 * @constructor
 */
async function GetFavorite(token){
    let id = await GetIdUser(token);
    if (id === -1){
        console.log("error in user search");
        return [];
    }
    let favorite_g = await favorite.findAll({
        where: {
            user_id: id
        }
    })
        .catch((err) => {
            console.log(err);
            return [];
        });
    return favorite_g.map((o) => o.dataValues.nickname_gamer);
}

/**
 * Получить иформации о играках из избранного
 * @param token токен пользователя
 * @returns {Promise<{gamer: []}>}  json с информацией об играках
 * @constructor
 */
async function GetInformationFavorite(token){
    let gamers = await GetFavorite(token);
    let mas = [];
    for (let gamer of gamers) {
        let ga = await GetInformationGamer(gamer);
        mas.push(ga);
    }
    return  {"gamer": mas};
}

/**
 * Получить информации о играке
 * @param gamer никнейм игрока
 * @returns {Promise<{lavel: (*|jQuery), nickname: *, photo: (undefined|string|jQuery)}>}  json с информацией об играке
 * @constructor
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
