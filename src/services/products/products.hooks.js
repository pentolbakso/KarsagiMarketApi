const { authenticate } = require("@feathersjs/authentication").hooks;
const { protect } = require("@feathersjs/authentication-local").hooks;

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
}

// TODO : check if user is store owner

module.exports = {
  before: {
    all: [],
    find: [sortByUpdated],
    get: [populateStoreAndOwner],
    create: [authenticate("jwt")],
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
