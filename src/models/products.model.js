// products-model.js - A mongoose model
const mongoose = require("mongoose");
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "products";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      store: { type: mongoose.ObjectId, required: true },
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number },
      weight: { type: Number, default: 0 },
      isNegotiable: { type: Boolean, default: false },
      isPromoPrice: { type: Boolean, default: false },
      isReadyStock: { type: Boolean, default: true },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
