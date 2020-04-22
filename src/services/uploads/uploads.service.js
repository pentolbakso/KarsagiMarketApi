// Initializes the `uploads` service on path `/uploads`
const { Uploads } = require("./uploads.class");
const createModel = require("../../models/uploads.model");
const { BadRequest } = require("@feathersjs/errors");
const hooks = require("./uploads.hooks");
const multer = require("multer");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: true,
  };

  const disk = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split(".").pop();
      //cb(null, `${Date.now()}-${file.originalname}`);
      cb(null, unique + "." + ext);
    },
  });
  const multipartMiddleware = multer({
    storage: disk,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10 megabytes
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/pjpeg"];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new BadRequest("Wrong image type"));
        return;
      }
      cb(null, true);
    },
  });

  app.use(
    "/uploads",
    multipartMiddleware.array("files"),
    function (req, res, next) {
      const { method } = req;
      if (method === "POST" || method === "PATCH") {
        const body = [];
        for (const file of req.files)
          body.push({
            filename: file.filename,
            path: file.path,
            size: file.size,
          });
        req.body = method === "POST" ? body : body[0];
      }
      next();
    },
    new Uploads(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("uploads");

  service.hooks(hooks);
};
