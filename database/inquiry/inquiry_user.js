const fs = require('fs');
const user = require('../models/user');
const crypto = require('crypto');

/**
 * @return {string}
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
        const path = SaveImage(avatar, token+'.jpg');



        await user.create({
            name: name,
            surname: surname,
            path_avatar: path,
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
 * @return {string}
 */
function SaveImage(path_from, path_to){
    fs.copyFile(path_from, 'public/images/'+path_to, (err) => {
        if (err)
            console.log(err);
    });
    return 'public/images/'+path_to;
}


/**
 * @return {string}
 */
function GenerateHash(text){
    return crypto.createHmac('sha256', process.env.CR_PASS)
        .update(text)
        .digest('hex');
}



/**
 * @return {string}
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

module.exports.SignUp = SignUp;
module.exports.SignIn = SignIn;