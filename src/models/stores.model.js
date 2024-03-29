// stores-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

module.exports = function (app) {
  const modelName = "stores";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      user: { type: mongoose.ObjectId, required: true, ref: "users" },
      status: { type: String, enum: ["open", "close"], default: "open" },
      title: { type: String, required: true },
      slug: { type: String },
      description: { type: String },
      phonenumber: { type: String },
      phonenumberAkhwat: { type: String },
      address: { type: String },
      location: {
        type: pointSchema,
      },
      instagram: { type: String },
      website: { type: String },
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
