const bookingModel = require("../models/booking.model");

class BookingController {
  getAllBookings = async (req, res) => {
    try {
      const bookings = await bookingModel
        .find({})
        .populate("doctor", "name")
        .populate("user", "name");

      if (!bookings.length) {
        return res.status(404).json({
          status: false,
          message: "Citas médicas no encontradas",
        });
      }

      res.status(200).json({
        status: true,
        message: "Citas médicas encontradas",
        bookings,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener las citas médicas",
        error: err.message,
      });
    }
  };

  getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        res
          .status(404)
          .json({ status: false, message: "Cita medica no encontrada" });
      }
      res.status(201).json({
        status: true,
        messge: "Cita meica encontrada",
        booking: booking,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener las cita medica",
        error: err.message,
      });
    }
  };

  deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findByIdAndDelete(id);
      if (!booking) {
        res
          .status(404)
          .json({ status: false, message: "Cita medica no encontrada" });
      }
      res.status(201).json({
        status: true,
        messge: "Cita meica eliminada",
        booking: booking,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar las cita medica",
        error: err.message,
      });
    }
  };

  cancelledAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.status === "pendiente" || "aprobada"
          ? "cancelada"
          : "pendiente";
      const statusUpdate = await bookingModel.findByIdAndUpdate(
        id,
        { status: statusChange },
        { new: true }
      );
      res.status(200).json(statusUpdate);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al cambiar el estado de la cita",
      });
    }
  };

  approvedAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.status === "cancelada" || "pendiente"
          ? "aprobada"
          : "pendiente";
      const statusUpdate = await bookingModel.findByIdAndUpdate(
        id,
        { status: statusChange },
        { new: true }
      );
      res.status(200).json(statusUpdate);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al cambiar el estado de la cita",
      });
    }
  };

  paidAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.is_paid === "No pagada" || "Pagada" ? "Pagada" : "No pagada";
      const statusUpdate = await bookingModel.findByIdAndUpdate(
        id,
        { is_paid: statusChange },
        { new: true }
      );
      res.status(200).json(statusUpdate);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al cambiar el estado de pago de la cita",
      });
    }
  };
}

module.exports = BookingController;
