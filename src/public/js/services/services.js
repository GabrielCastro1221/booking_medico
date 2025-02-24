document.addEventListener("DOMContentLoaded", () => {
  const mainServices = document.getElementById("main-services");

  const services = [
    {
      icon: "fa-solid fa-calendar-days",
      title: "Agendar citas médicas",
      description:
        "En nuestra plataforma, los pacientes tienen la posibilidad de agendar citas médicas tanto de manera virtual como presencial. Nuestra plataforma garantiza que cada paciente pueda acceder a la atención médica de calidad que necesita.",
      "keywords": "citas médicas, agendar citas médicas, citas virtuales, citas presenciales, consulta médica online, atención médica personalizada, agenda médica, servicios de salud"
    },
    {
      icon: "fa-regular fa-credit-card",
      title: "Métodos de Pago online y precencial",
      description:
        "Si se agenda una cita presencial el paciente podrá realizar el pago en el sitio de la consulta médica, pero si la cita es online el pago deberá hacerse via nequi o cuenta bancaria para que el enlace de la video consulta se active.",
      "keywords": "métodos de pago, pago online, pago presencial, pasarela de pagos, Nequi, transferencia bancaria, citas médicas online, video consulta, activación de servicios médicos"
    },
    {
      icon: "fa-solid fa-user-doctor",
      title: "Perfil de doctores",
      description:
        "Cada doctor deberá diligenciar un formulario en el que se almacenará la información sobre su especialidad y los horarios disponibles para las citas médicas. Cuando el perfil sea aprobado, podrá recibir citas de sus pacientes.",
     "keywords": "perfil de doctores, especialidad médica, horarios de citas médicas, registro de médicos, formulario médico, aprobación de perfiles, atención especializada, citas con especialistas"
    },
    {
      icon: "fa-solid fa-file-signature",
      title: "Contrato de enfermeras",
      description:
        "En nuestra plataforma, los pacientes tienen la posibilidad de contratar los servicios de las enfermeras registradas. Nuestra plataforma garantiza que cada paciente pueda acceder a la atención médica de calidad que necesita.",
      "keywords": "contrato de enfermeras, servicios de enfermería, atención médica, cuidado de pacientes, enfermeras registradas, contratación de enfermeras, salud en casa, atención personalizada, enfermeras a domicilio, calidad médica"
    },
    {
      "icon": "fa-solid fa-building",
      "title": "Consultorios médicos disponibles",
      "description": "Los doctores tienen la posibilidad de publicar consultorios médicos para venta o alquiler. Este espacio está diseñado para facilitar la conexión entre personas que buscan un lugar adecuado para ejercer.",
      "keywords": "consultorios médicos, venta de consultorios, alquiler de consultorios, espacio médico, consultorios disponibles, profesionales de la salud, inmobiliaria médica, alquiler de espacios médicos"
    },    
    {
      icon: "fa-solid fa-user-nurse",
      title: "Perfil de enfermeras",
      description:
        "Cada enfermera deberá diligenciar un formulario en el que se almacenará la información sobre su especialidad y los servicios disponibles para los pacientes. Cuando el perfil sea aprobado, podrá recibir citas de sus pacientes.",
      "keywords": "perfil de enfermeras, servicios de enfermería, especialidad en enfermería, registro de enfermeras, atención de pacientes, aprobación de perfiles, cuidado de la salud, citas de enfermería"
    },
  ];

  services.forEach((service) => {
    const article = document.createElement("article");
    article.className = "inner-services";

    const iconDiv = document.createElement("div");
    iconDiv.className = "service-icon";
    iconDiv.setAttribute("role", "img");
    iconDiv.setAttribute("aria-label", service.title);

    const icon = document.createElement("i");
    icon.className = service.icon;
    icon.setAttribute("aria-hidden", "true");

    const h3 = document.createElement("h3");
    h3.textContent = service.title;
    h3.setAttribute("data-seo-keywords", service.keywords);

    const p = document.createElement("p");
    p.textContent = service.description;

    iconDiv.appendChild(icon);
    article.appendChild(iconDiv);
    article.appendChild(h3);
    article.appendChild(p);

    mainServices.appendChild(article);
  });
});
