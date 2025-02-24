const nodemailer = require("nodemailer");
const configObject = require("../config/env.config");
const { logger } = require("../middlewares/logger.middleware");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: configObject.mailer.email_service,
      auth: {
        user: configObject.mailer.mailer_user,
        pass: configObject.mailer.mailer_pass,
      },
    });
  }

  async enviarCorreoRestablecimiento(email, token) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Health Point Manizales - Recuperar contraseña",
        html: ` <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
        <div style="text-align: center; margin-bottom: 20px;"> 
          <h1 style="color: #1b715e;">Health Point Manizales</h1>
        </div> 
        <h2 style="color: #1b715e;">Olvidaste tu contraseña?</h2> 
        <p>Has olvidado tu contraseña? no te preocupes con el siguiente codigo de confirmacion podras actualizar tu contraseña</p> <p>codigo de confirmacion: <strong style="color: #1b715e;">${token}</strong>.</p> 
        <h3 style="color: #1b715e;">¡Este token expira en una hora!</h3> 
        <div style="text-align: center; margin-top: 20px;"> 
          <a href="${configObject.server.base_url}/change-password" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Recuperar contraseña</a> 
        </div> 
      </div> `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar Email de restablecimiento de contraseña:",
        error.message
      );
    }
  }

  async enviarCorreoBienvenidaDoctor(email) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Bienvenido a Health Point Manizales",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
          <div style="text-align: center; margin-bottom: 20px;"> 
            <h1 style="color: #1b715e;">Health Point Manizales</h1>
          </div> 
          <h2 style="color: #1b715e;">¡Bienvenido a Health Point Manizales!</h2> 
          <p>Te has registrado como un doctor en nuestra plataforma. Para aprobar tu perfil, por favor completa todos los datos y realiza el pago de:</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:/${configObject.mailer.mailer_user}" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Contactar</a>
          </div>
          <p>Una vez aprobado tu perfil, podrás recibir citas médicas de tus pacientes a través de nuestra plataforma.</p>
        </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de bienvenida al doctor:",
        error.message
      );
    }
  }
  

  async enviarCorreoNuevoDoctor(doctorData) {
    try {
      const { name, email } = doctorData;
      const Opt = {
        from: configObject.mailer.email_from,
        to: "medicobooking21@gmail.com",
        subject: "Nuevo Registro de Doctor en Health Point Manizales",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
              <div style="text-align: center; margin-bottom: 20px;"> 
                <h1 style="color: #1b715e;">Health Point Manizales</h1>
              </div> 
              <h2 style="color: #1b715e;">Nuevo Registro de Doctor</h2> 
              <p>Se ha registrado un nuevo doctor en la plataforma con los siguientes datos:</p>
              <ul>
                <li><strong>Nombre:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
              </ul>
              <p>Por favor, revise la información y tome las acciones necesarias para aprobar el perfil del doctor.</p>
            </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de notificación de nuevo doctor:",
        error.message
      );
    }
  }

  async enviarCorreoCitaAgendada(emailDoctor, appointmentDetails) {
    try {
      const { patientName, patientEmail, appointmentDate, ticketPrice, type } =
        appointmentDetails;
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailDoctor,
        subject: "Nueva Cita Agendada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #1b715e;">Health Point Manizales</h1>
                </div>
                <h2 style="color: #1b715e;">Nueva Cita Presencial</h2>
                <p><strong>Paciente:</strong> ${patientName}</p>
                <p><strong>Email del Paciente:</strong> ${patientEmail}</p>
                <p><strong>Fecha y Hora:</strong> ${new Date(
                  appointmentDate
                ).toLocaleString()}</p>
                <p><strong>Precio del Ticket:</strong> $${ticketPrice}</p>
                <p><strong>Tipo:</strong> ${type}</p>
            </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar correo de cita agendada:", error.message);
    }
  }

  async enviarCorreoCitaOnline(emailDoctor, appointmentDetails) {
    try {
      const {
        patientName,
        patientEmail,
        appointmentDate,
        ticketPrice,
        bookingId,
      } = appointmentDetails;
      const onlineMeetingLink = `${configObject.server.base_url}/video-consulta/${bookingId}`;
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailDoctor,
        subject: "Nueva Cita Online Agendada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #1b715e;">Health Point Manizales</h1>
                </div>
                <h2 style="color: #1b715e;">Nueva Cita Online</h2>
                <p><strong>Paciente:</strong> ${patientName}</p>
                <p><strong>Email del Paciente:</strong> ${patientEmail}</p>
                <p><strong>Fecha y Hora:</strong> ${new Date(
                  appointmentDate
                ).toLocaleString()}</p>
                <p><strong>Precio del Ticket:</strong> $${ticketPrice}</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${onlineMeetingLink}" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Unirse a la Video Consulta</a>
                </div>
            </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar correo de cita online:", error.message);
    }
  }

  async enviarCorreoCitaPaciente(emailPaciente, appointmentDetails) {
    try {
      const { doctorName, doctorPhone, appointmentDate, ticketPrice, type } =
        appointmentDetails;
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailPaciente,
        subject: "Cita Agendada Correctamente",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #1b715e;">Health Point Manizales</h1>
                    </div>
                    <h2 style="color: #1b715e;">Tu Cita se Agendó Correctamente</h2>
                    <p><strong>Doctor:</strong> ${doctorName}</p>
                    <p><strong>Teléfono del Doctor:</strong> ${doctorPhone}</p>
                    <p><strong>Fecha y Hora:</strong> ${new Date(
                      appointmentDate
                    ).toLocaleString()}</p>
                    <p><strong style="color: #1b715e;">Precio del Ticket:</strong> $${ticketPrice}</p>
                    <p><strong style="color: #1b715e;">Tipo:</strong> ${type}</p>
                    <p>Debes hacer la consignación por la aplicación de Nequi o dirigirte a un corresponsal bancario y consignar el valor de $${ticketPrice}. Una vez hagas el giro, debes enviar el comprobante de pago para aprobar tu cita medica.</p>
                    <a href="tel: ${doctorPhone}" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Enviar Comprabante de pago</a>
                </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar correo al paciente:", error.message);
    }
  }

  async enviarCorreoCambioRolAdmin(emailUsuario, userName) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailUsuario,
        subject: "Felicitaciones, ahora eres Administrador",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #1b715e;">Health Point Manizales</h1>
                    </div>
                    <h2 style="color: #1b715e;">¡Felicitaciones, ${userName}!</h2>
                    <p>Nos complace informarte que ahora eres Administrador de la página.</p>
                    <p>Con este nuevo rol, tendrás acceso a funcionalidades adicionales y podrás gestionar la plataforma de manera más eficiente.</p>
                    <p>Gracias por tu compromiso y dedicación.</p>
                </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar correo de cambio de rol:", error.message);
    }
  }

  async enviarCorreoAprobacionDoctor(emailDoctor, doctorName) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailDoctor,
        subject: "Tu cuenta como Doctor ha sido aprobada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #1b715e;">Health Point Manizales</h1>
                    </div>
                    <h2 style="color: #1b715e;">¡Felicitaciones, ${doctorName}!</h2>
                    <p>Tu cuenta como doctor ha sido aprobada. Ahora podrás recibir citas médicas de tus pacientes de manera online y presencial.</p>
                    <p>Es un placer tenerte en nuestro equipo de trabajo.</p>
                </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de aprobación de cuenta:",
        error.message
      );
    }
  }

  async enviarCorreoCancelacionDoctor(emailDoctor, doctorName) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailDoctor,
        subject: "Tu cuenta como Doctor ha sido cancelada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #1b715e;">Health Point Manizales</h1>
                    </div>
                    <h2 style="color: #1b715e;">Estimado/a ${doctorName},</h2>
                    <p>Lamentamos informarte que tu cuenta como doctor ha sido cancelada. Ya no podrás recibir citas médicas de tus pacientes de manera online o presencial.</p>
                    <p>Si tienes alguna pregunta o necesitas más información, por favor ponte en contacto con nuestro equipo de soporte.</p>
                    <p>Gracias por tu comprensión.</p>
                    <a href="mailto: medicobooking21@gmail.com" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Soporte Tecnico</a>
                </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de cancelación de cuenta:",
        error.message
      );
    }
  }

  async enviarCorreoNuevaEnfermera(enfermeraData) {
    try {
      const { name, email } = enfermeraData;
      const Opt = {
        from: configObject.mailer.email_from,
        to: "medicobooking21@gmail.com",
        subject: "Nuevo Registro de Enfermera en Health Point Manizales",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #1b715e;">Health Point Manizales</h1>
            </div>
            <h2 style="color: #1b715e;">Nuevo Registro de Enfermera</h2>
            <p>Se ha registrado una nueva enfermera en la plataforma con los siguientes datos:</p>
            <ul>
              <li><strong>Nombre:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
            </ul>
            <p>Por favor, revise la información y tome las acciones necesarias para aprobar el perfil de la enfermera.</p>
          </div>
        `,
      };
      await this.transporter.sendMail(Opt);
      console.log("Correo enviado correctamente sobre nueva enfermera.");
    } catch (error) {
      logger.error(
        "Error al enviar correo de notificación de nueva enfermera:",
        error.message
      );
    }
  }

  async enviarCorreoBienvenidaEnfermera(email) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Bienvenida a Health Point Manizales",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
          <div style="text-align: center; margin-bottom: 20px;"> 
            <h1 style="color: #1b715e;">Health Point Manizales</h1>
          </div> 
          <h2 style="color: #1b715e;">¡Bienvenida a Health Point Manizales!</h2> 
          <p>Te has registrado como una enfermera en nuestra plataforma. Para completar tu registro y poder comenzar a recibir asignaciones de tareas, por favor completa todos los datos requeridos en tu perfil.</p>
          <p>A continuación, te proporcionamos algunas recomendaciones para optimizar tu perfil:</p>
          <ul>
            <li><strong style="color: #1b715e;">Completa tu biografía</strong>: Agrega detalles sobre tu experiencia y especialización.</li>
            <li><strong style="color: #1b715e;">Sube una foto profesional</strong>: Asegúrate de que tu foto sea clara y representativa.</li>
            <li><strong style="color: #1b715e;">Configura tu disponibilidad</strong>: Indica los horarios en los que estás disponible para recibir asignaciones de pacientes.</li>
          </ul>
          <p>Una vez completados estos pasos, tu perfil será revisado y aprobado para que puedas comenzar a trabajar a través de nuestra plataforma.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        </div>`,
      };
      await this.transporter.sendMail(Opt);
      console.log("Correo de bienvenida enviado exitosamente a la enfermera.");
    } catch (error) {
      logger.error(
        "Error al enviar correo de bienvenida a la enfermera:",
        error.message
      );
    }
  }

  async enviarCorreoCancelacionEnfermera(emailEnfermera, enfermeraName) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailEnfermera,
        subject: "Tu cuenta como Enfermera ha sido cancelada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                  <div style="text-align: center; margin-bottom: 20px;">
                      <h1 style="color: #1b715e;">Health Point Manizales</h1>
                  </div>
                  <h2 style="color: #1b715e;">Estimado/a ${enfermeraName},</h2>
                  <p>Lamentamos informarte que tu cuenta como enfermera ha sido cancelada. A partir de este momento, ya no podrás recibir asignaciones ni tareas de atención a pacientes a través de nuestra plataforma.</p>
                  <p>Si consideras que esta decisión fue tomada por error o tienes alguna duda, por favor ponte en contacto con nuestro equipo de soporte.</p>
                  <p>Gracias por tu comprensión y por haber formado parte de nuestra comunidad.</p>
                  <a href="mailto: medicobooking21@gmail.com" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Soporte Técnico</a>
              </div>`,
      };
      await this.transporter.sendMail(Opt);
      console.log("Correo de cancelación enviado exitosamente a la enfermera.");
    } catch (error) {
      logger.error(
        "Error al enviar correo de cancelación a la enfermera:",
        error.message
      );
    }
  }

  async enviarCorreoAprobacionEnfermera(emailEnfermera, enfermeraName) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: emailEnfermera,
        subject: "Tu cuenta como Enfermera ha sido aprobada",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                  <div style="text-align: center; margin-bottom: 20px;">
                      <h1 style="color: #1b715e;">Health Point Manizales</h1>
                  </div>
                  <h2 style="color: #1b715e;">¡Felicitaciones, ${enfermeraName}!</h2>
                  <p>Tu cuenta como enfermera ha sido aprobada. Ahora podrás comenzar a recibir tareas y asignaciones de atención a pacientes tanto de manera online como presencial.</p>
                  <p>Es un placer contar contigo en nuestro equipo de trabajo. ¡Esperamos que tengas una exitosa experiencia en nuestra plataforma!</p>
              </div>`,
      };
      await this.transporter.sendMail(Opt);
      console.log("Correo de aprobación enviado exitosamente a la enfermera.");
    } catch (error) {
      logger.error(
        "Error al enviar correo de aprobación a la enfermera:",
        error.message
      );
    }
  }
}

module.exports = EmailManager;
