const { protect } = require("@feathersjs/authentication-local").hooks;
const { authenticate } = require("@feathersjs/authentication").hooks;

// Initializes the `auth` service on path `/auth`
class MeService {
  setup(app) {
    this.app = app;
  }
  async find(params) {
    return params.user;
  }
}

module.exports = function (app) {
  app.use("/me", new MeService());
  app.service("me").hooks({
    before: {
      all: [authenticate("jwt")],
    },
    after: {
      all: [protect("password")],
    },
  });
};
