document.addEventListener("DOMContentLoaded", async () => {
  const nurseCardContainer = document.getElementById("nurses-card-container");

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/v1/nurses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (
      data.status === true &&
      Array.isArray(data.enfermeras) &&
      data.enfermeras.length > 0
    ) {
      data.enfermeras.forEach((nurse) => {
        const nurseCard = document.createElement("div");
        nurseCard.classList.add("nurses-card");

        const renderList = (items, emptyMessage = "N/A") => {
          if (!items || items.length === 0) {
            return emptyMessage;
          }
          return `<ul>${items
            .map((item) => {
              if (typeof item === "object") {
                return `<li>${Object.values(item).join(" - ")}</li>`;
              }
              return `<li>${item}</li>`;
            })
            .join("")}</ul>`;
        };

        nurseCard.innerHTML = `
          <div class="nurses-photo">
            <img src="${
              nurse.photo ||
              "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png"
            }" alt="Foto de la enfermera">
          </div>
          <div class="nurses-info">
            <h2>${nurse.name}</h2>
            <p><strong>Email:</strong> ${nurse.email}</p>
            <p><strong>Teléfono:</strong> ${nurse.phone || "N/A"}</p>
            <p><strong>Especialización:</strong> ${
              nurse.specialization || "N/A"
            }</p>
            <p><strong>Educación:</strong> ${renderList(nurse.education)}</p>
            <p><strong>Experiencias:</strong> ${renderList(
              nurse.experiences
            )}</p>
            <p><strong>Servicios:</strong> ${renderList(nurse.services)}</p>
            <p><strong>Estado:</strong> <span class="nurse-status">${
              nurse.isApproved
            }</span></p>
            <div class="btn-nurses">
              <button class="approveNurse" data-id="${
                nurse._id
              }">Aprobar</button>
              <button class="cancelNurse" data-id="${
                nurse._id
              }">Cancelar</button>
              <button class="deleteNurse" data-id="${
                nurse._id
              }">Eliminar</button>
            </div>
          </div>
        `;
        const approveButton = nurseCard.querySelector(".approveNurse");
        approveButton.addEventListener("click", async (event) => {
          const nurseId = event.target.dataset.id;

          try {
            const approveResponse = await fetch(
              `/api/v1/nurses/${nurseId}/approval-status`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const approveData = await approveResponse.json();

            if (approveResponse.ok) {
              const nurseStatusElement =
                nurseCard.querySelector(".nurse-status");
              nurseStatusElement.textContent = approveData.data.isApproved;
            } else {
              console.error("Error al aprobar la enfermera:", approveData);
            }
          } catch (err) {
            console.error("Error al aprobar la enfermera:", err);
          }
        });

        const cancelButton = nurseCard.querySelector(".cancelNurse");
        cancelButton.addEventListener("click", async (event) => {
          const nurseId = event.target.dataset.id;

          try {
            const cancelResponse = await fetch(
              `/api/v1/nurses/${nurseId}/cancelled-status`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const cancelData = await cancelResponse.json();

            if (cancelResponse.ok) {
              const nurseStatusElement =
                nurseCard.querySelector(".nurse-status");
              nurseStatusElement.textContent = cancelData.data.isApproved;
            } else {
              console.error("Error al cancelar la enfermera:", cancelData);
            }
          } catch (err) {
            console.error("Error al cancelar la enfermera:", err);
          }
        });

        const deleteButton = nurseCard.querySelector(".deleteNurse");
        deleteButton.addEventListener("click", async (event) => {
          const nurseId = event.target.dataset.id;

          try {
            const deleteResponse = await fetch(`/api/v1/nurses/${nurseId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const deleteData = await deleteResponse.json();

            if (deleteResponse.ok) {
              nurseCardContainer.removeChild(nurseCard);
            } else {
              console.error("Error al eliminar la enfermera:", deleteData);
            }
          } catch (err) {
            console.error("Error al eliminar la enfermera:", err);
          }
        });

        nurseCardContainer.appendChild(nurseCard);
      });
    } else {
      const messageParagraph = document.createElement("p");
      messageParagraph.textContent =
        "No hay enfermeras registradas en la plataforma.";
      messageParagraph.style.color = "#000";
      messageParagraph.style.textAlign = "center";
      nurseCardContainer.appendChild(messageParagraph);
    }
  } catch (error) {
    console.error("Error fetching nurses:", error);
    const errorParagraph = document.createElement("p");
    errorParagraph.textContent = "Error al cargar los datos de las enfermeras.";
    errorParagraph.style.color = "#000";
    errorParagraph.style.textAlign = "center";
    nurseCardContainer.appendChild(errorParagraph);
  }
});
