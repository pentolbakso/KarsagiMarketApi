const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [
      authenticate("jwt"),
      (context) => {
        //since we allow multiple upload, the data is an array
        context.data.forEach((element) => {
          //append user id from jwt
          element.user = context.params.user._id;
        });
        //console.log(context.data);
        return context;
      },
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
