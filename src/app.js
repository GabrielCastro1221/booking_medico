const express = require("express");
require("./config/connection.config");
const bodyParserMiddleware = require("./middlewares/bodyParser.middleware");
const handlebarsMiddleware = require("./middlewares/handlebars.middleware");
const setupRoutes = require("./middlewares/routes.middleware");
const serverMiddleware = require("./middlewares/server.middleware");

const app = express();

bodyParserMiddleware(app);
handlebarsMiddleware(app);
setupRoutes(app);
serverMiddleware(app);