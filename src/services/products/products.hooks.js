const { authenticate } = require("@feathersjs/authentication").hooks;
const { protect } = require("@feathersjs/authentication-local").hooks;
const { slugify } = require("../../utils/formatter");

function populateStoreAndOwner(context) {
  context.params.query["$populate"] = {
    path: "store",
    populate: {
      path: "user",
    },
  };
  return context;
}

function sortByUpdated(context) {
  context.params.query["$sort"] = { updatedAt: -1 };
  return context;
}

function searchRegex(context) {
  const query = context.params.query;
  for (let field in query) {
    //console.log(field, query[field]);
    if (query[field].$search && field.indexOf("$") == -1) {
      query[field] = { $regex: new RegExp(query[field].$search, "i") };
    }
  }
  //console.log("q", query);
  context.params.query = query;
  return context;
}

function slugFromName(context) {
  if (context.data.name) {
    context.data.slug = slugify(context.data.name);
  }

  return context;
}

// TODO : check if user is store owner

module.exports = {
  before: {
    all: [],
    find: [sortByUpdated, searchRegex],
    get: [populateStoreAndOwner],
    create: [authenticate("jwt"), slugFromName],
    update: [authenticate("jwt")],
    patch: [authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [],
    find: [],
    get: [protect("store.user.password")],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
