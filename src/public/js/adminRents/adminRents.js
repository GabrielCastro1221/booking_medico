document.addEventListener("DOMContentLoaded", async () => {
  const rentsCardContainer = document.getElementById("rents-card-container");

  try {
    const response = await fetch("/api/v1/rent");
    const data = await response.json();

    if (data.status && data.rentas.length > 0) {
      data.rentas.forEach((rent) => {
        const rentCard = document.createElement("div");
        rentCard.classList.add("rents-card");

        rentCard.innerHTML = `<div class="rents-photo">
              <img src="${
                rent.img ||
                "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png"
              }" alt="Foto de la renta">
            </div>
            <div class="rents-info">
              <h2>${rent.title}</h2>
              <p>${rent.description}</p>
              <p><strong>Precio:</strong> ${rent.price || "N/A"}</p>
              <p><strong>Dimensiones:</strong> ${rent.dimension || "N/A"}</p>
              <p><strong>Dirección:</strong> ${rent.address}</p>
              <p><strong>Propietario:</strong> ${rent.owner}</p>
              <p><strong>Teléfono:</strong> ${rent.owner_phone}</p>
              <p><strong>Email:</strong> ${rent.owner_email}</p>
              <p><strong>Tipo Renta:</strong> ${rent.sell_rent}</p>
              <p><strong>Categoría:</strong> <span class="nurse-status">${
                rent.category
              }</span></p>
              <p><strong>Estado:</strong> <span class="nurse-status">${
                rent.status
              }</span></p>
              <p><strong>Estado de aprobación:</strong> <span class="nurse-status">${
                rent.isApproved
              }</span></p>
              <div class="btn-rents">
                <div>
                  <button class="changeRentedStatus" data-id="${
                    rent._id
                  }">Alquilado</button>
                  <button class="changeAvaliableStatus" data-id="${
                    rent._id
                  }">Disponible</button>
                </div>
                <div class="mt-1">
                  <button class="approveRent" data-id="${
                    rent._id
                  }">Aprobar</button>
                </div>
                <div class="red-btn mt-1">
                  <button class="cancelRent" data-id="${
                    rent._id
                  }">Cancelar</button>
                  <button class="deleteRent" data-id="${
                    rent._id
                  }">Eliminar</button>
                  </div>
              </div>
            </div>
          `;

        rentsCardContainer.appendChild(rentCard);
      });

      document.querySelectorAll(".deleteRent").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const rentId = event.target.getAttribute("data-id");
          try {
            const response = await fetch(`/api/v1/rent/${rentId}`, {
              method: "DELETE",
            });
            const result = await response.json();
            if (result.status) {
              Toastify({
                text: "Renta eliminada con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              location.reload();
            } else {
              Toastify({
                text: "Error al eliminar la renta",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          } catch (error) {
            console.error("Error al eliminar la renta:", error);
            Toastify({
              text: "Error al eliminar la renta",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        });
      });

      document.querySelectorAll(".approveRent").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const rentId = event.target.getAttribute("data-id");
          try {
            const response = await fetch(
              `/api/v1/rent/${rentId}/approval-status`,
              {
                method: "PUT",
              }
            );
            const result = await response.json();
            if (result.success) {
              Toastify({
                text: "Renta aprobada con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              location.reload();
            } else {
              Toastify({
                text: "Error al aprobar la renta",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          } catch (error) {
            console.error("Error al aprobar la renta:", error);
            Toastify({
              text: "Error al aprobar la renta",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        });
      });

      document.querySelectorAll(".cancelRent").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const rentId = event.target.getAttribute("data-id");
          try {
            const response = await fetch(
              `/api/v1/rent/${rentId}/cancelled-status`,
              {
                method: "PUT",
              }
            );
            const result = await response.json();
            if (result.success) {
              Toastify({
                text: "Renta cancelada con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              location.reload();
            } else {
              Toastify({
                text: "Error al cancelar la renta",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          } catch (error) {
            console.error("Error al cancelar la renta:", error);
            Toastify({
              text: "Error al cancelar la renta",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        });
      });

      document.querySelectorAll(".changeAvaliableStatus").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const rentId = event.target.getAttribute("data-id");
          try {
            const response = await fetch(
              `/api/v1/rent/${rentId}/avaliable-status`,
              {
                method: "PUT",
              }
            );
            const result = await response.json();
            if (result.success) {
              Toastify({
                text: "Estado de renta cambiado a disponible con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              location.reload();
            } else {
              Toastify({
                text: "Error al cambiar el estado de la renta a disponible",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          } catch (error) {
            console.error(
              "Error al cambiar el estado de la renta a disponible:",
              error
            );
            Toastify({
              text: "Error al cambiar el estado de la renta a disponible",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        });
      });

      document.querySelectorAll(".changeRentedStatus").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const rentId = event.target.getAttribute("data-id");
          try {
            const response = await fetch(
              `/api/v1/rent/${rentId}/rented-status`,
              {
                method: "PUT",
              }
            );
            const result = await response.json();
            if (result.success) {
              Toastify({
                text: "Estado de renta cambiado a alquilado con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              location.reload();
            } else {
              Toastify({
                text: "Error al cambiar el estado de la renta a alquilado",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          } catch (error) {
            console.error(
              "Error al cambiar el estado de la renta a alquilado:",
              error
            );
            Toastify({
              text: "Error al cambiar el estado de la renta a alquilado",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        });
      });
    } else {
      rentsCardContainer.innerHTML = "<p>No hay rentas registradas en la plataforma.</p>";
    }
  } catch (error) {
    console.error("Error al obtener las rentas:", error);
    rentsCardContainer.innerHTML = "<p>Error al obtener las rentas.</p>";
  }
});
