const request = require('request-promise');
const cheerio = require('cheerio');
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
async function ParsingSite(gamer) {
  const url = process.env.PR_URL + gamer;

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
  } catch (e) {
    console.log(e);

    throw e;
    // return {
    //   status: 'false',
    // };
  }

  if (body.indexOf('Профиль не найден') === -1) {
    json = {
      status: 'true',
    };
  } else {
    json = {
      status: 'false',
    };
  }

  return json;
}

/**
 * Запрос id пользователя
 * @param token токен пользователя
 * @returns {Promise<*>} id
 * @constructor
 */
async function GetIdUser(token) {
  const userBd = await user.findOne({
    where: {
      token,
    },
  })
    .catch((err) => {
      console.log(err);

      return -1;
    });

  return userBd.dataValues.id;
}

/**
 * Добваление в избранное
 * @param token токен пользователя
 * @param gamer никнейм игрока
 * @returns {Promise<boolean>} статус операции
 * @constructor
 */
async function AddFavorite(token, gamer) {
  const id = await GetIdUser(token);

  const sherch = await favorite.findOne({
    where: {
      user_id: id,
      nickname_gamer: gamer,
    },
  })
    .catch((err) => {
      console.log(err);

      return false;
    });

  if (sherch !== null) return true;

  let json;

  try {
    json = await CheckGamer(gamer);
  } catch (e) {
    throw e;
  }

  if (json.status === 'false') return false;

  await favorite.create({
    user_id: id,
    nickname_gamer: gamer,
  })
    .catch(async (err) => {
      console.log(err);

      throw err;
    });

  return true;
}

/**
 * список играков в избранном
 * @param token токен пользователя
 * @returns {Promise<Uint8Array|BigInt64Array|any[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array>}
 *      json со списком никнеймов играков
 * @constructor
 */
async function GetFavorite(token) {
  const id = await GetIdUser(token);

  if (id === -1) {
    console.log('error in user search');

    return [];
  }
  const favoriteG = await favorite.findAll({
    where: {
      user_id: id,
    },
  })
    .catch((err) => {
      console.log(err);

      return [];
    });

  return favoriteG.map((o) => o.dataValues.nickname_gamer);
}

/**
 * Получить информации о играке
 * @param gamer никнейм игрока
 * @returns {Promise<{lavel: (*|jQuery), nickname: *, photo: (undefined|string|jQuery)}>}  json с информацией об играке
 * @constructor
 */
async function GetInformationGamer(gamer) {
  const body = await ParsingSite(gamer);
  const $ = cheerio.load(body);
  let level = $('div.u-vertical-center').text();

  level = level.slice(0, level.length / 2);
  const photo = $('img.player-portrait').attr('src');

  return {
    nickname: gamer,
    lavel: level,
    photo,
  };
}

/**
 * Получить иформации о играках из избранного
 * @param token токен пользователя
 * @returns {Promise<{gamer: []}>}  json с информацией об играках
 * @constructor
 */
async function GetInformationFavorite(token) {
  const gamers = await GetFavorite(token);
  const mas = [];

  for (const gamer of gamers) {
    const ga = await GetInformationGamer(gamer);

    mas.push(ga);
  }

  return { gamer: mas };
}

module.exports.CheckCookie = CheckCookie;
module.exports.CheckGamer = CheckGamer;
module.exports.AddFavorite = AddFavorite;
module.exports.GetInformationFavorite = GetInformationFavorite;
