document.addEventListener("DOMContentLoaded", () => {
  const menubar = document.querySelector("#menu-bars");
  const navbar = document.querySelector(".navbar");

  const links = [
    { href: "/inicio", text: "Inicio" },
    { href: "/doctores", text: "Doctores" },
    { href: "/enfermeras", text: "Enfermeras" },
    { href: "/contacto", text: "Contáctanos" },
    { href: "/faq", text: "FAQ" },
  ];

  const navbarContainer = document.getElementById("navbar");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.role === "admin") {
  } else {
    links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      a.setAttribute("title", link.text);
      navbarContainer.appendChild(a);
    });
  }

  menubar.addEventListener("click", () => {
    menubar.classList.toggle("fa-times");
    navbar.classList.toggle("active");
  });

  const authButton = document.getElementById("auth-button");

  if (user) {
    authButton.textContent = "Perfil";
    if (user.role === "doctor") {
      authButton.href = "/perfil-doctor";
    } else if (user.role === "paciente") {
      authButton.href = "/perfil-usuario";
    } else if (user.role === "admin") {
      authButton.href = "/perfil-admin";
    } else if (user.role === "enfermera") {
      authButton.href = "/perfil-enfermera";
    }
  } else {
    authButton.textContent = "Ingresar";
    authButton.href = "/";
  }
});
