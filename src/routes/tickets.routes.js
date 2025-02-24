const { Router } = require("express");
const TicketController = require("../controller/ticket.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const ticket = new TicketController();
const auth = new AuthMiddleware();

router.get("/", ticket.getAllTickets);
router.get("/:id", ticket.getTicketById);

router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["admin"]),
  ticket.deleteTicket
);

module.exports = router;
