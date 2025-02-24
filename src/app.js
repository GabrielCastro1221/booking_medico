const express = require("express");
require("./config/connection.config");
const app = express();
const setupRoutes = require("./middlewares/routes.middleware");
const handlebarsMiddleware = require("./middlewares/handlebars.middleware");
const bodyParserMiddleware = require("./middlewares/bodyParser.middleware");
const serverMiddleware = require("./middlewares/server.middleware");

bodyParserMiddleware(app);
handlebarsMiddleware(app);
setupRoutes(app);
serverMiddleware(app);
