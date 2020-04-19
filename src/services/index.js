const users = require("./users/users.service.js");
const stores = require("./stores/stores.service.js");
const products = require("./products/products.service.js");
const register = require("./auth/register.service.js");
//const resetPassword = require("./auth/resetPassword.service.js");
const me = require("./auth/me.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(stores);
  app.configure(products);
  app.configure(register);
  app.configure(me);
};
