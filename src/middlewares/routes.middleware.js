const viewsRouter = require("../routes/views.routes");
const authRouter = require("../routes/auth.routes");
const userRouter = require("../routes/user.routes");
const doctorRouter = require("../routes/doctor.routes");
const meetingRouter = require("../routes/meeting.routes");
const bookingRouter = require("../routes/booking.routes");
const ticketRouter = require("../routes/tickets.routes");
const uploadRouter = require("../routes/upload.routes");
const nursesRouter = require("../routes/nurses.routes");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const { swaggerOptions } = require("../middlewares/swagger.middleware");

const specs = swaggerJSDoc(swaggerOptions);

const setupRoutes = (app) => {
  app.use("/", viewsRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/doctors", doctorRouter);
  app.use("/api/v1/agora", meetingRouter);
  app.use("/api/v1/bookings", bookingRouter);
  app.use("/api/v1/tickets", ticketRouter);
  app.use("/api/v1", uploadRouter);
  app.use("/api/v1/nurses", nursesRouter);
  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
};

module.exports = setupRoutes;
