// Initializes the `auth` service on path `/auth`
class ResetPasswordService {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    return {
      message: "not implemented",
    };
  }
}

module.exports = function (app) {
  app.use("/password/reset", new ResetPasswordService());
};
