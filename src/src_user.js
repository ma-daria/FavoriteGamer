const fs = require('fs');
const user = require('../database/models/user');
const crypto = require('crypto');
const path = require('path');

/**
 * регестрация
 * @param fields данные пользователя
 * @param files аватарка
 * @returns {Promise<string>} результаты регестрации
 * @constructor
 */
async function SignUp(fields, files) {
    const name = fields.name["0"];
    const surname = fields.surname["0"];
    const avatar = files.avatar["0"].path;
    const email = fields.email["0"];
    let password = fields.password["0"];

    let user_bd = await user.findOne({
        where: {
            email: email
        }
    })
        .catch((err) => {
            console.log(err)
        });
    if (user_bd == null){
        password = GenerateHash(password);
        let token = GenerateHash(email);
        const path_ = SaveImage(avatar, token+path.extname(avatar));

        await user.create({
            name: name,
            surname: surname,
            path_avatar: path_,
            email: email,
            password: password,
            token: token
        })
            .catch(async (err) => {
                console.log(err);
            });
        return token;
    }else
        return 'no ok';
}


/**
 * сохранение аватарки
 * @param path_from ссылка где исходник
 * @param path_to ссылка названия изображения
 * @returns {string} ссылка куда было сохранено
 * @constructor
 */
function SaveImage(path_from, path_to){
    fs.copyFile(path_from, 'public/images/'+path_to, (err) => {
        if (err)
            console.log(err);
    });
    return 'public/images/'+path_to;
}

/**
 * гененрация хэша
 * @param text исходный текст
 * @returns {string} сгенерирвоанный текс
 * @constructor
 */
function GenerateHash(text){
    return crypto.createHmac('sha256', process.env.CR_PASS)
        .update(text)
        .digest('hex');
}

/**
 * вход в систему
 * @param email эмайл
 * @param password пароль
 * @returns {Promise<string|{unique: boolean, type: StringDataType}|{unique: boolean, type: StringDataType}>} реузльтат входа
 * @constructor
 */
async function SignIn(email, password){
    let user_bd = await user.findOne({
        where: {
            email: email
        }
    })
        .catch((err) => {
            console.log(err)
        });
    if (user_bd === null)
        return "no ok";
    if ( user_bd.dataValues.password === GenerateHash(password))
        return user_bd.dataValues.token;
    return "no ok";
}

/**
 * получить размер заданного файла
 * @param file ссылка до файла
 * @returns {Promise<unknown>} размер
 * @constructor
 */
async function GetSizeFile(file){
    return await new Promise(function (resolve, reject) {
        fs.stat(file, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats.size);
        });
    });
}

module.exports.SignUp = SignUp;
module.exports.SignIn = SignIn;
module.exports.GetSizeFile = GetSizeFile;