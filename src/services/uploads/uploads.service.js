// Initializes the `uploads` service on path `/uploads`
const { Uploads } = require("./uploads.class");
const createModel = require("../../models/uploads.model");
const { BadRequest } = require("@feathersjs/errors");
const hooks = require("./uploads.hooks");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

function createDir(dir) {
  if (!fs.existsSync(dir, { recursive: true })) {
    fs.mkdirSync(dir);
  }
}

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: false, //set true for multi upload
  };

  const UPLOAD_DIR = "public/uploads/images";
  createDir(UPLOAD_DIR);
  createDir(UPLOAD_DIR + "/ori");

  // for conversions
  const imageSizes = [200, 600];
  imageSizes.forEach((size) => {
    createDir(UPLOAD_DIR + "/" + size);
  });

  const disk = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR + "/ori");
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split(".").pop();
      //cb(null, `${Date.now()}-${file.originalname}`);
      cb(null, unique + "." + ext);
      // let id = new mongoose.Types.ObjectId();
      // cb(null, id);
    },
  });
  const multipartMiddleware = multer({
    storage: disk,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 megabytes
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
    multipartMiddleware.single("file"), //change to .array for multiple
    function (req, res, next) {
      const { method } = req;
      if (method === "POST" || method === "PATCH") {
        /*  //multi upload codes
        const body = [];
        for (const file of req.files)
          body.push({
            filename: file.filename,
            path: file.path,
            size: file.size,
          });
        req.body = method === "POST" ? body : body[0];
        */
        imageSizes.forEach((size) => {
          sharp(req.file.path)
            .resize(size, size, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .jpeg({ quality: 70 })
            .toFile(UPLOAD_DIR + "/" + size + "/" + req.file.filename + ".jpeg")
            .then((data) => {
              sharp.cache(false);
              // fs.unlink('./public/images/building/' + 'temp_' + filename)
              console.log("done resizing " + size + " -> " + req.file.filename);
            })
            .catch((err) => {
              console.log("ERR resizing " + req.file.filename + " => " + err);
            });
        });

        req.body = {
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        };
      }
      next();
    },
    new Uploads(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("uploads");

  service.hooks(hooks);
};
