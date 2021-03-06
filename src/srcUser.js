const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const user = require('../database/models/user');

/**
 * гененрация хэша
 * @param text исходный текст
 * @returns {string} сгенерирвоанный текс
 * @constructor
 */
function GenerateHash(text) {
  return crypto.createHmac('sha256', process.env.CR_PASS)
    .update(text)
    .digest('hex');
}

/**
 * сохранение аватарки
 * @param pathFrom ссылка где исходник
 * @param pathTo ссылка названия изображения
 * @returns {string} ссылка куда было сохранено
 * @constructor
 */
function SaveImage(pathFrom, pathTo) {
  fs.copyFile(pathFrom, `${process.env.UPLOAD_PATH}${pathTo}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  return process.env.UPLOAD_PATH + pathTo;
}

function UserError(er) {
  Error.call(this, user) ;
  this.name = "UserError";

  this.er = er;
  this.message = "user " + er;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, UserError);
  } else {
    this.stack = (new Error()).stack;
  }
}
UserError.prototype = Object.create(Error.prototype);

/**
 * регистрация
 * @param fields данные пользователя
 * @param files аватарка
 * @returns {Promise<string>} результаты регистрации
 * @constructor
 */
async function SignUp(fields, files) {
  const name = fields.name['0'];
  const surname = fields.surname['0'];
  const avatar = files.avatar['0'].path;
  const email = fields.email['0'];
  let password = fields.password['0'];

  const userBd = await user.findOne({
    where: {
      email,
    },
  })
    .catch((err) => {
      console.log(err);

      throw err;
    });

  if (userBd == null) {
    password = GenerateHash(password);
    const token = GenerateHash(email);
    const pathImg = SaveImage(avatar, token + path.extname(avatar));

    await user.create({
      name,
      surname,
      path_avatar: pathImg,
      email,
      password,
      token,
    })
      .catch(async (err) => {
        console.log(err);

        throw err;
      });

    return token;
  }

  throw new UserError('exists');
}

/**
 * вход в систему
 * @param email эмайл
 * @param password пароль
 * @returns {Promise<string|{unique: boolean, type: StringDataType}|{unique: boolean, type: StringDataType}>} реузльтат входа
 * @constructor
 */
async function SignIn(email, password) {
  const userBd = await user.findOne({
    where: {
      email,
    },
  })
    .catch((err) => {
      console.log(err);

      throw err;
    });

  if (userBd === null) throw new UserError('does not exist');
  if (userBd.dataValues.password === GenerateHash(password)) return userBd.dataValues.token;

  throw new UserError('wrong password');
}

/**
 * получить размер заданного файла
 * @param file ссылка до файла
 * @returns {Promise<unknown>} размер
 * @constructor
 */
async function GetSizeFile(file) {
  return await new Promise(((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats.size);
    });
  }));
}

module.exports.SignUp = SignUp;
module.exports.SignIn = SignIn;
module.exports.GetSizeFile = GetSizeFile;
