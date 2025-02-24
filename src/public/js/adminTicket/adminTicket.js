const ticketCardContainer = document.getElementById("ticket-card-container");

async function fetchTicket() {
  try {
    const response = await fetch("/api/v1/tickets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (!data.status) {
      ticketCardContainer.innerHTML = "<p>No se han generado tickets en la plataforma.</p>";
      return;
    }

    renderTickets(data.tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    ticketCardContainer.innerHTML = "<p>Error al cargar los tickets.</p>";
  }
}

function renderTickets(tickets) {
  ticketCardContainer.innerHTML = "";
  tickets.forEach((ticket) => {
    const card = document.createElement("div");
    card.classList.add("ticket-card");
    card.innerHTML = `
      <div class="ticket-info">
        <p><strong>Id cita medica:</strong> ${ticket._id}</p>
        <p><strong>Fecha:</strong> ${new Date(
          ticket.appointment_date
        ).toLocaleString()}</p>
        <p><strong>Codigo:</strong> $${ticket.code}</p>
        <p><strong>Precio:</strong> ${ticket.amount}</p>
        <div class="btn-ticket">
          <button class="deleteticket" data-id="${ticket._id}">Eliminar</button>
        </div>
      </div>
    `;

    ticketCardContainer.appendChild(card);
  });

  document.querySelectorAll(".deleteticket").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const ticketId = event.target.getAttribute("data-id");
      try {
        const response = await fetch(`/api/v1/tickets/${ticketId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Ticket eliminada con éxito",
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
            text: "Error al eliminar el ticket",
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#FF0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error al eliminar el ticket:", error);
        Toastify({
          text: "Error al eliminar el ticket",
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
fetchTicket();
