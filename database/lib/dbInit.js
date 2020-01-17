const Favorite = require('../models/favorite');
const User = require('../models/user');

User.hasMany(Favorite, {
  foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade',
});
Favorite.belongsTo(User, {
  foreignKey: 'user_id', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade',
});

async function init() {
  // await User.sync({force:true});
  // await Favorite.sync({force:true});

  await User.sync();
  await Favorite.sync();
}

(async function f() {
  await init();
}());
