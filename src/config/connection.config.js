const mongoose = require("mongoose");
const configObject = require("./env.config");
const { logger } = require("../middlewares/logger.middleware");

class DataBase {
  static #instance;
  constructor() {
    this.connectWithRetry();
  }

  async connectWithRetry() {
    try {
      await mongoose.connect(configObject.server.mongo_url, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info("Conexion con la base de datos de la plataforma HealthPoint Manizales exitosa!");
    } catch (err) {
      logger.error(`Error en la conexion con mongoDB ${err.message}`);
      setTimeout(() => {
        logger.info("Reintentando conectarse a la base de datos");
        this.connectWithRetry();
      }, 5000);
    }
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DataBase();
    }
    return this.#instance;
  }
}

module.exports = DataBase.getInstance();
