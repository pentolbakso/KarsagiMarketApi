// Initializes the `stores` service on path `/stores`
const { Stores } = require("./stores.class");
const createModel = require("../../models/stores.model");
const hooks = require("./stores.hooks");

function mapUserIdToData(context) {
  if (context.data && context.params.route.userId) {
    context.data.user = context.params.route.userId;
  }
}
module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/stores", new Stores(options, app));
  const service = app.service("stores");
  service.hooks(hooks);

  // setup our nested routes
  //app.use("/users/:userId/stores", app.service("stores"));
  app.use("/users/:userId/stores", new Stores(options, app));
  app.service("users/:userId/stores").hooks({
    before: {
      find(context) {
        if (context.params.route.userId)
          context.params.query.user = context.params.route.userId;
      },
      create: mapUserIdToData,
      update: mapUserIdToData,
      patch: mapUserIdToData,
    },
  });
};
