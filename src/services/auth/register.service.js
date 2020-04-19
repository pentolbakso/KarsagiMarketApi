const { protect } = require("@feathersjs/authentication-local").hooks;

// Initializes the `auth` service on path `/auth`
class RegisterService {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    const { storeTitle, ...userData } = data;
    // save user
    const users = this.app.service("users");
    const user = await users.create(userData);
    // save store
    if (storeTitle) {
      const stores = this.app.service("stores");
      await stores.create({ user: user._id, title: storeTitle });
    }
    //generate token and return
    const auth = this.app.service("authentication");
    const resp = await auth.create({
      strategy: "local",
      email: userData.email,
      password: userData.password,
    });
    return resp;
  }
}

module.exports = function (app) {
  app.use("/register", new RegisterService());
  app.service("register").hooks({
    after: {
      all: [protect("user.password")],
    },
  });
};
