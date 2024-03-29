/* eslint-disable no-console */
const logger = require("./logger");
const app = require("./app");
const port = app.get("port");
// hide feathersjs behind nginx = add localhost
const server = app.listen(
  port,
  process.env.NODE_ENV == "production" ? "localhost" : undefined
);

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () =>
  logger.info(
    "Feathers application started on http://%s:%d",
    app.get("host"),
    port
  )
);
