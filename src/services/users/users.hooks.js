const { authenticate } = require("@feathersjs/authentication").hooks;

const {
  hashPassword,
  protect,
} = require("@feathersjs/authentication-local").hooks;
const { iff, disallow } = require("feathers-hooks-common");

// if logged-in , restrict to admin only
const restrictToAdmin = [
  iff(
    (context) => context.params.user && context.params.user.role != "admin",
    disallow()
  ),
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate("jwt"), //somehow ini kyk ga dipanggil jika dipanggil dari register
      ...restrictToAdmin,
      hashPassword("password"),
    ],
    update: [authenticate("jwt"), hashPassword("password")],
    patch: [authenticate("jwt"), hashPassword("password")],
    remove: [authenticate("jwt"), ...restrictToAdmin],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
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
