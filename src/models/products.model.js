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
      store: { type: mongoose.ObjectId, required: true, ref: "stores" },
      name: { type: String, required: true },
      description: { type: String },
      category: { type: String },
      price: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      isPromoPrice: { type: Boolean, default: false },
      isReadyStock: { type: Boolean, default: true },
      photos: [{ type: Object }],
      notes: { type: String },
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
