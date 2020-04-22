const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [
      authenticate("jwt"),
      (context) => {
        //console.log(context.data);

        //multiple file upload
        // context.data.forEach((element) => {
        //   //append user id from jwt
        //   element.user = context.params.user._id;
        // });

        //single file upload
        context.data.user = context.params.user._id;
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
