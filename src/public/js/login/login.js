document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    window.location.href = "/inicio";
    return;
  }

  const loginForm = document.querySelector(".form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        let redirectUrl = "/inicio";
        if (data.data.role === "doctor") {
          redirectUrl = "/perfil-doctor";
        } else if (data.data.role === "paciente") {
          redirectUrl = "/perfil-usuario";
        } else if (data.data.role === "admin") {
          redirectUrl = "/perfil-admin";
        } else if (data.data.role === "enfermera") {
          redirectUrl = "/perfil-enfermera";
        }

        window.location.href = redirectUrl;

        Toastify({
          text: "Inicio de sesión exitoso!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#4CAF50",
          stopOnFocus: true,
          style: {
            fontSize: "18px",
          },
        }).showToast();
      } else {
        Toastify({
          text: data.message || "Error al iniciar sesión",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
          stopOnFocus: true,
          style: {
            fontSize: "18px",
          },
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: "Error al conectar con el servidor",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
        stopOnFocus: true,
        style: {
          fontSize: "18px",
        },
      }).showToast();
    }
  });
});
