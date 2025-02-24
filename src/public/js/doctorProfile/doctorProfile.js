document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tabs-btns button");
  const contents = document.querySelectorAll(".tab-content");
  const logoutButton = document.querySelector(".logout-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  function handleButtonClick(button) {
    const target = button.getAttribute("data-target");
    if (target === "profile") {
      window.location.reload();
    } else {
      contents.forEach((content) => {
        content.style.display = content.id === target ? "block" : "none";
      });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  async function fetchDoctorProfile() {
    try {
      const response = await fetch("/api/v1/doctors/profile/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos del perfil");
      }

      const data = await response.json();

      if (data.success) {
        updateProfile(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  function updateProfile(data) {
    document.getElementById("doctor-photo").src = data.photo;
    document.getElementById("specialization").textContent = data.specialization;
    document.getElementById("doctor-name").textContent = data.name;
    document.getElementById("bio").textContent = data.bio;
    document.querySelector(".info-name").textContent = data.name;
    document.querySelector(".info-about").textContent = data.about;

    updateList(
      ".education-list",
      data.education,
      (edu) => `
      <div>
        <span class="date">${new Date(
          edu.startingDate
        ).toLocaleDateString()} - ${new Date(
        edu.endingDate
      ).toLocaleDateString()}</span>
        <p class="degree">${edu.degree}</p>
      </div>
      <p class="university">${edu.university}</p>
    `
    );

    updateList(
      ".experience-list",
      data.experiences,
      (exp) => `
      <div>
        <span class="date">${new Date(
          exp.startingDate
        ).toLocaleDateString()} - ${new Date(
        exp.endingDate
      ).toLocaleDateString()}</span>
        <p class="position">${exp.position}</p>
      </div>
      <p class="hospital">${exp.hospital}</p>
    `
    );

    updateList(
      "#appointments .card-body",
      data.appoinments,
      (appt) => `
      <div class="card">
        <p><strong>ID del Paciente:</strong> ${appt.user}</p>
        <p><strong>Fecha de la Cita:</strong> ${new Date(
          appt.appointment_date
        ).toLocaleString()}</p>
        <p><strong>Pagado:</strong> ${appt.status}</p>
        <p><strong>Precio del Boleto:</strong> $${appt.ticket_price}</p>
        <p><strong>Tipo:</strong> ${appt.type}</p>
        <div class="btns-act">
        <button class="app" data-id="${appt._id}" title="Aprobar cita medica">Aprobar</button>
        ${
          appt.type === "online"
            ? `<p><strong></strong> <a class="video_link" title="Unirse a la video consulta" href="/video-consulta/${appt._id}" target="_blank"><i class="fa-solid fa-video"></i></a></p>`
            : ""
        }
        <div>
      </div>
    `
    );

    updateList(
      "#rents-card-container",
      data.rents,
      (rent) => `
      <div class="card-rent">
        <img src="${rent.img}" alt="${rent.title}" />
        <p><strong class="str">Titulo:</strong> ${rent.title}</p>
        <p><strong class="str">Descripcion:</strong> ${rent.description}</p>
        <p><strong class="str">Precio:</strong> $${rent.price}</p>
        <p><strong class="str">Estado:</strong> ${rent.status}</p>
        <p><strong class="str">Ubicación:</strong> ${rent.address}</p>
        <div class="btns-act">
          <button class="available" data-id="${rent._id}">Disponible</button>
          <button class="rented" data-id="${rent._id}">Alquilado</button>
          <button class="delete" data-id="${rent._id}">Eliminar</button>
        </div>
      </div>
    `
    );
  }

  function updateList(selector, items, createItemHTML) {
    const list = document.querySelector(selector);
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = selector.slice(1, -5) + "-item";
      li.innerHTML = createItemHTML(item);
      list.appendChild(li);
    });
  }

  async function changeStatusAppointment(id) {
    try {
      const response = await fetch(`/api/v1/doctors/approved/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el estado de la cita");
      }

      const data = await response.json();
      console.log("Estado de la cita actualizado:", data);
      Swal.fire({
        icon: "success",
        title: "Cita aprobada con éxito",
        showConfirmButton: false,
        timer: 3000,
      });
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al aprobar la cita",
        showConfirmButton: true,
      });
    }
  }

  async function changeAvailableStatus(id) {
    try {
      const response = await fetch(`/api/v1/rent/${id}/avaliable-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el estado de la renta");
      }

      const data = await response.json();
      console.log("Estado de la renta actualizado:", data);
      Swal.fire({
        icon: "success",
        title: "Estado de renta actualizado a disponible",
        showConfirmButton: false,
        timer: 1000,
      });
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el estado de la renta",
        showConfirmButton: true,
      });
    }
  }

  async function changeRentedStatus(id) {
    try {
      const response = await fetch(`/api/v1/rent/${id}/rented-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el estado de la renta");
      }

      const data = await response.json();
      console.log("Estado de la renta actualizado:", data);
      Swal.fire({
        icon: "success",
        title: "Estado de renta actualizado a alquilado",
        showConfirmButton: false,
        timer: 1000,
      });
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el estado de la renta",
        showConfirmButton: true,
      });
    }
  }

  async function deleteRent(id) {
    try {
      const confirmation = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
      });

      if (confirmation.isConfirmed) {
        const response = await fetch(`/api/v1/rent/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar la renta");
        }

        const data = await response.json();
        console.log("Renta eliminada:", data);
        Swal.fire({
          icon: "success",
          title: "Renta eliminada con éxito",
          showConfirmButton: false,
          timer: 1000,
        });
        fetchDoctorProfile();
      }
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar la renta",
        showConfirmButton: true,
      });
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("app")) {
      const appointmentId = e.target.getAttribute("data-id");
      changeStatusAppointment(appointmentId);
    } else if (e.target.classList.contains("available")) {
      const rentId = e.target.getAttribute("data-id");
      changeAvailableStatus(rentId);
    } else if (e.target.classList.contains("rented")) {
      const rentId = e.target.getAttribute("data-id");
      changeRentedStatus(rentId);
    } else if (e.target.classList.contains("delete")) {
      const rentId = e.target.getAttribute("data-id");
      deleteRent(rentId);
    }
  });

  fetchDoctorProfile();
});
