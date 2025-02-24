const { Router } = require("express");
const BookingController = require("../controller/booking.controller");

const router = Router();
const booking = new BookingController();

router.get("/", booking.getAllBookings);
router.get("/:id", booking.getBookingById);
router.put("/:id/cancelled-status", booking.cancelledAppointment);
router.put("/:id/approved-status", booking.approvedAppointment);
router.put("/paid/:id", booking.paidAppointment);
router.delete("/:id", booking.deleteBooking);

module.exports = router;
