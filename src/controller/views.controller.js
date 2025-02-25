const doctorModel = require("../models/doctor.model");
const nurseModel = require("../models/nurses.model");

class ViewsController {
  renderHome = (req, res) => {
    try {
      res.render("home");
    } catch (err) {
      res.render("404");
    }
  };

  renderLogin = (req, res) => {
    try {
      res.render("login");
    } catch (err) {
      res.render("404");
    }
  };

  renderServices = (req, res) => {
    try {
      res.render("services");
    } catch (err) {
      res.render("404");
    }
  };

  renderDoctors = async (req, res) => {
    try {
      const doctors = await doctorModel.find({ isApproved: "approved" }).lean();
      if (!doctors || doctors.length === 0) {
        return res.render("doctors", {
          doctors: null,
          message: "Lo sentimos, No hay doctores disponibles en este momento...",
        });
      }
      res.render("doctors", { doctors });
    } catch (err) {
      res.render("404");
    }
  };

  renderContact = (req, res) => {
    try {
      res.render("contact");
    } catch (err) {
      res.render("404");
    }
  };

  renderRegister = (req, res) => {
    try {
      res.render("register");
    } catch (err) {
      res.render("404");
    }
  };

  renderNotFound = (req, res) => {
    try {
      res.render("404");
    } catch (err) {
      res.render("404");
    }
  };

  renderAccessDenied = (req, res) => {
    try {
      res.render("accessDenied");
    } catch (err) {
      res.render("404");
    }
  };
 
  renderFaq = (req, res) => {
    try {
      res.render("faq");
    } catch (err) {
      res.render("404");
    }
  };

  renderResetPass = (req, res) => {
    try {
      res.render("resetPass");
    } catch (err) {
      res.render("404");
    }
  };

  renderChangePass = (req, res) => {
    try {
      res.render("changePass");
    } catch (err) {
      res.render("404");
    }
  };

  renderEmailConfirm = (req, res) => {
    try {
      res.render("emailConfirm");
    } catch (err) {
      res.render("404");
    }
  };

  renderDoctorDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await doctorModel.findById(id).lean();
      if (!doctor) {
        return res.render("404", { message: "Doctor no encontrado" });
      }
      res.render("doctorDetail", { doctor });
    } catch (err) {
      res.render("404", { message: "Error al obtener los datos del doctor" });
    }
  };

  renderDoctorProfile = (req, res) => {
    try {
      res.render("doctorProfile");
    } catch (err) {
      res.render("404");
    }
  };

  renderSearchDoctor = async (req, res) => {
    const { query } = req.query;
    try {
      const doctors = await doctorModel
        .find({
          isApproved: "approved",
          name: { $regex: query, $options: "i" },
        })
        .lean();
      if (!doctors || doctors.length === 0) {
        return res.render("doctors", {
          doctors: null,
          message: "Doctores no encontrados",
        });
      }
      res.render("doctors", { doctors });
    } catch (err) {
      res.render("404");
    }
  };

  renderUserProfile = (req, res) => {
    try {
      res.render("userProfile");
    } catch (err) {
      res.render("404");
    }
  };

  renderAdminProfile = (req, res) => {
    try {
      res.render("adminProfile");
    } catch (err) {
      res.render("404");
    }
  };

  renderMeeting = (req, res) => {
    try {
      res.render("meeting");
    } catch (err) {
      res.render("404");
    }
  };

  renderNurses = async (req, res) => {
    try {
      const nurses = await nurseModel.find({ isApproved: "approved" }).lean();
      if (!nurses || nurses.length === 0) {
        return res.render("nurses", {
          doctors: null,
          message: "Lo sentimos, No hay enfermeras disponibles en este momento...",
        });
      }
      res.render("nurses", { nurses });
    } catch (err) {
      res.render("404");
    }
  };

  renderNursesDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const nurse = await nurseModel.findById(id).lean();
      if (!nurse) {
        return res.render("404", { message: "Enfermera no encontrada" });
      }
      res.render("nursesDetail", { nurse });
    } catch (err) {
      res.render("404", { message: "Error al obtener los datos del doctor" });
    }
  };

  renderNursesProfile = (req, res) => {
    try {
      res.render("nursesProfile");
    } catch (err) {
      res.render("404");
    }
  };
}

module.exports = ViewsController;
