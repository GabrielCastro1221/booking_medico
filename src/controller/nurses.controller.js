const nursesModel = require("../models/nurses.model");
const EmailManager = require("../services/mailer");

const mailer = new EmailManager();

class NursesController {
  getAllNurses = async (req, res) => {
    try {
      const nurses = await nursesModel.find({});
      if (!nurses) {
        res
          .status(404)
          .json({ status: false, message: "Enfermeras no encontradas" });
      }
      res.status(201).json({
        status: true,
        message: "Enfermeras encontradas",
        enfermeras: nurses,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener las enfermeras",
        error: err.message,
      });
    }
  };

  getNursesById = async (req, res) => {
    const { id } = req.params;
    try {
      const nurse = await nursesModel.findById(id);
      if (!nurse) {
        res
          .status(404)
          .json({ status: false, message: "Enfermeras no encontradas" });
      }
      res.status(201).json({
        status: true,
        message: "Enfermera encontrada",
        enfermera: nurse,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener la enfermera",
        error: err.message,
      });
    }
  };

  updateNurse = async (req, res) => {
    const { id } = req.params;
    try {
      let photoUrl = req.body.photo;
      if (req.file) {
        photoUrl = req.file.path;
      }

      const education = req.body.education
        ? JSON.parse(req.body.education)
        : undefined;
      const experiences = req.body.experiences
        ? JSON.parse(req.body.experiences)
        : undefined;
      const services = req.body.services
        ? JSON.parse(req.body.services)
        : undefined;

      const updateData = { ...req.body, photo: photoUrl };

      if (education) updateData.education = education;
      if (experiences) updateData.experiences = experiences;
      if (services) updateData.services = services;

      const updateNurse = await nursesModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updateNurse) {
        return res.status(404).json({
          status: false,
          message: "Enfermera no encontrada",
        });
      }

      res.status(200).json({
        status: true,
        message: "Enfermera actualizada con éxito",
        enfermera: updateNurse,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar la enfermera",
        error: err.message,
      });
    }
  };

  deleteNurse = async (req, res) => {
    const { id } = req.params;
    try {
      const nurse = await nursesModel.findByIdAndDelete(id);
      if (!nurse) {
        res
          .status(404)
          .json({ status: false, message: "Enfermeras no encontradas" });
      }
      res.status(201).json({
        status: true,
        message: "Enfermera eliminada",
        enfermera: nurse,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar la enfermera",
        error: err.message,
      });
    }
  };

  getNurseProfile = async (req, res) => {
    const nurseId = req.userId;
    try {
      const nurse = await nursesModel.findById(nurseId);
      if (!nurse) {
        return res.status(404).json({
          success: false,
          message: "Enfermera no encontrada",
        });
      }
      const { password, ...rest } = nurse._doc;
      res.status(200).json({
        success: true,
        message: "Informacion del perfil obtenida satisfactoriamente",
        data: { ...rest },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la informacion del perfil",
      });
    }
  };

  changeApprovalStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const nurse = await nursesModel.findById(id);
      if (!nurse) {
        return res.status(404).json({
          success: false,
          message: "Enfermera no encontrado",
        });
      }
      const updatednurse = await nursesModel.findByIdAndUpdate(
        id,
        { isApproved: "approved" },
        { new: true }
      );
      const emailEnfermera = nurse.email;
      const enfermeraName = nurse.name;
      await mailer.enviarCorreoAprobacionEnfermera(
        emailEnfermera,
        enfermeraName
      );
      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "approved"`,
        data: updatednurse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };

  cancelledStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const nurse = await nursesModel.findById(id);
      if (!nurse) {
        return res.status(404).json({
          success: false,
          message: "Enfermera no encontrada",
        });
      }
      const updatednurse = await nursesModel.findByIdAndUpdate(
        id,
        { isApproved: "cancelled" },
        { new: true }
      );
      const emailEnfermera = nurse.email;
      const enfermeraName = nurse.name;
      await mailer.enviarCorreoCancelacionEnfermera(
        emailEnfermera,
        enfermeraName
      );
      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "cancelled"`,
        data: updatednurse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };
}

module.exports = NursesController;
