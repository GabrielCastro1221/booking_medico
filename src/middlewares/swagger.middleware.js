const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentacion API Health Point Manizales",
        description:
          "Plataforma medica para la gestion de citas y consultas medicas",
      },
    },
    apis: ["./src/docs/**/*.yaml"],
  };

  module.exports = { swaggerOptions };