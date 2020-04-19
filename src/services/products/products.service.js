// Initializes the `products` service on path `/products`
const { Products } = require("./products.class");
const createModel = require("../../models/products.model");
const hooks = require("./products.hooks");

function mapStoreIdToData(context) {
  if (context.data && context.params.route.storeId) {
    context.data.store = context.params.route.storeId;
  }
}

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/products", new Products(options, app));
  // Get our initialized service so that we can register hooks
  const service = app.service("products");
  service.hooks(hooks);

  // setup our nested routes
  app.use("/stores/:storeId/products", app.service("products"));
  app.service("stores/:storeId/products").hooks({
    before: {
      find(context) {
        context.params.query.store = context.params.route.storeId;
      },
      create: mapStoreIdToData,
      update: mapStoreIdToData,
      patch: mapStoreIdToData,
    },
  });
};
