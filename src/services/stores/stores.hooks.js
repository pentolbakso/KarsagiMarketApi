const { authenticate } = require("@feathersjs/authentication").hooks;
const { setField } = require("feathers-authentication-hooks");
const { iff } = require("feathers-hooks-common");
const { protect } = require("@feathersjs/authentication-local").hooks;

// restrict to owner and admin!
const restrict = [
  //console.log("params",context.params);
  authenticate("jwt"),
  iff(
    (context) => context.params.user && context.params.user.role != "admin",
    setField({
      from: "params.user._id",
      as: "params.query.user",
    })
  ),
];

function populateOwner(context) {
  context.params.query["$populate"] = {
    path: "user",
  };
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [populateOwner],
    create: [...restrict],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict],
  },

  after: {
    all: [],
    find: [],
    get: [protect("user.password")],
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
