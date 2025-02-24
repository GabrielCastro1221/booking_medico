const bookingCardContainer = document.getElementById("booking-card-container");

async function fetchBookings() {
  try {
    const response = await fetch("/api/v1/bookings", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (!data.status) {
      bookingCardContainer.innerHTML =
        "<p>No hay citas médicas agendadas en la plataforma.</p>";
      return;
    }

    renderBookings(data.bookings);
  } catch (error) {
    console.error("Error al obtener las citas médicas:", error);
    bookingCardContainer.innerHTML =
      "<p>Error al cargar las citas médicas.</p>";
  }
}

function renderBookings(bookings) {
  bookingCardContainer.innerHTML = "";
  bookings.forEach((booking) => {
    const card = document.createElement("div");
    card.classList.add("booking-card");
    card.innerHTML = `
      <div class="booking-info">
        <h2>${booking.doctor?.name || "Doctor desconocido"}</h2>
        <p><strong>Paciente:</strong> ${
          booking.user?.name || "Usuario desconocido"
        }</p>
        <p><strong>Fecha:</strong> ${new Date(
          booking.appointment_date
        ).toLocaleString()}</p>
        <p><strong>Precio:</strong> $${booking.ticket_price.toFixed(2)}</p>
        <p><strong>Tipo:</strong> ${booking.type}</p>
        <p><strong>Estado de pago:</strong> <span>${booking.is_paid}</span></p>
        <p><strong>Estado de aprobacion:</strong> <span>${
          booking.status
        }</span></p>
        <div class="btn-booking">
          <button class="paidBooking" data-id="${booking._id}">Pagada</button>
          <button class="approveBooking" data-id="${
            booking._id
          }">Aprobar</button>
          <button class="cancelBooking" data-id="${
            booking._id
          }">Cancelar</button>
          <button class="deleteBooking" data-id="${
            booking._id
          }">Eliminar</button>
        </div>
      </div>
    `;

    bookingCardContainer.appendChild(card);
  });

  document.querySelectorAll(".deleteBooking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = event.target.getAttribute("data-id");
      try {
        const response = await fetch(`/api/v1/bookings/${bookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Cita médica eliminada con éxito",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#4CAF50",
          }).showToast();
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          Toastify({
            text: "Error al eliminar la cita médica",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#FF0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al eliminar la cita médica:", error);
        Toastify({
          text: "Error al eliminar la cita médica",
          duration: 1000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    });
  });

  document.querySelectorAll(".cancelBooking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = event.target.getAttribute("data-id");
      try {
        const response = await fetch(
          `/api/v1/bookings/${bookingId}/cancelled-status`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Estado de la cita cambiado con éxito",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#4CAF50",
          }).showToast();
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          Toastify({
            text: "Error al cambiar el estado de la cita",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#FF0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al cambiar el estado de la cita:", error);
        Toastify({
          text: "Error al cambiar el estado de la cita",
          duration: 1000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    });
  });

  document.querySelectorAll(".approveBooking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = event.target.getAttribute("data-id");
      try {
        const response = await fetch(
          `/api/v1/bookings/${bookingId}/approved-status`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Cita médica aprobada con éxito",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#4CAF50",
          }).showToast();
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          Toastify({
            text: "Error al aprobar la cita médica",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#FF0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al aprobar la cita médica:", error);
        Toastify({
          text: "Error al aprobar la cita médica",
          duration: 1000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    });
  });

  document.querySelectorAll(".paidBooking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = event.target.getAttribute("data-id");
      try {
        const response = await fetch(`/api/v1/bookings/paid/${bookingId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Cita médica pagada con éxito",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#4CAF50",
          }).showToast();
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          Toastify({
            text: "Error al aprobar el pago de la cita médica",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#FF0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al aprobar el pago la cita médica:", error);
        Toastify({
          text: "Error al aprobar la cita médica",
          duration: 1000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    });
  });
}
fetchBookings();
