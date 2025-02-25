document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tabs-btns .group-1");
  const tabContents = document.querySelectorAll(".tab-content");
  const logoutButton = document.querySelector(".logout-button");
  const deleteButton = document.querySelector(".delete-button");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      tabContents.forEach((content) => {
        content.style.display = "none";
      });
      document.getElementById(target).style.display = "block";
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  async function fetchNurseProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("/api/v1/nurses/profile/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        displayNurseProfile(data.data);
        localStorage.setItem("nurseId", data.data._id);
      } else {
        console.error(data.message);
        showErrorToast(data.message || "Error al obtener el perfil.");
      }
    } catch (error) {
      console.error("Error al obtener el perfil de la enfermera:", error);
      showErrorToast("Error al obtener el perfil de la enfermera.");
    }
  }

  function displayNurseProfile(nurse) {
    document.getElementById("enfermera-photo").src = nurse.photo;
    document.getElementById("specialization").textContent =
      nurse.specialization;
    document.getElementById("enfermera-name").textContent = nurse.name;
    document.getElementById("bio").textContent = nurse.bio;
    document.querySelector(".info-name").textContent = nurse.name;
    document.querySelector(".info-about").textContent = nurse.about;

    const educationList = document.querySelector(".education-list");
    educationList.innerHTML = "";
    nurse.education.forEach((edu) => {
      const li = document.createElement("li");
      li.classList.add("education-item");
      li.innerHTML = `
        <div>
          <span class="date">${edu.startingDate} - ${edu.endingDate}</span>
          <p class="degree">${edu.degree}</p>
        </div>
        <p class="university">${edu.university}</p>
      `;
      educationList.appendChild(li);
    });

    const experienceList = document.querySelector(".experience-list");
    experienceList.innerHTML = "";
    nurse.experiences.forEach((exp) => {
      const li = document.createElement("li");
      li.classList.add("experience-item");
      li.innerHTML = `
        <div>
          <span class="date">${exp.startingDate} - ${exp.endingDate}</span>
          <p class="position">${exp.position}</p>
        </div>
        <p class="hospital">${exp.hospital}</p>
      `;
      experienceList.appendChild(li);
    });

    const serviceList = document.querySelector(".service-list");
    serviceList.innerHTML = "";
    nurse.services.forEach((serv) => {
      const li = document.createElement("li");
      li.classList.add("experience-item");
      li.innerHTML = `
        <div>
          <span class="date">${serv.title}</span>
          <p class="position">${serv.description}</p>
        </div>
      `;
      serviceList.appendChild(li);
    });

    document.querySelector(".profile-info").style.display = "block";
    document.querySelector(".info-section").style.display = "block";
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const token = localStorage.getItem("token");
      const nurseId = localStorage.getItem("nurseId");

      if (!token || !nurseId) {
        showErrorToast("No se encontró información de la enfermera.");
        return;
      }

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar mi cuenta",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`/api/v1/nurses/${nurseId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await response.json();

            if (data.status) {
              showSuccessToast("Tu cuenta ha sido eliminada exitosamente.");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("nurseId");
              window.location.href = "/";
            } else {
              showErrorToast(data.message || "Error al eliminar la cuenta.");
            }
          } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
            showErrorToast("Hubo un error al intentar eliminar la cuenta.");
          }
        }
      });
    });
  }

  function showSuccessToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "#4CAF50",
    }).showToast();
  }

  function showErrorToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "#FF0000",
    }).showToast();
  }

  fetchNurseProfile();
});
