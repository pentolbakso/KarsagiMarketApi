const { authenticate } = require("@feathersjs/authentication").hooks;
const { setField } = require("feathers-authentication-hooks");
const { iff } = require("feathers-hooks-common");

// restrict to owner and admin!
const restrict = [
  //console.log("params",context.params);
  authenticate("jwt"),
  iff(
    (context) => context.params.user.role != "admin",
    setField({
      from: "params.user._id",
      as: "params.query.user",
    })
  ),
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [...restrict],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict],
  },

  after: {
    all: [],
    find: [],
    get: [],
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
