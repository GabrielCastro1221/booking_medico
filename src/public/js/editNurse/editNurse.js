document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const uploadButton = document.getElementById("uploadButton");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const bioInput = document.getElementById("bio");
  const aboutInput = document.getElementById("about");
  const specializationInput = document.getElementById("specialization");

  const nurseData = JSON.parse(localStorage.getItem("user"));
  if (nurseData) {
    nameInput.value = nurseData.name;
    emailInput.value = nurseData.email;
    phoneInput.value = nurseData.phone || "";
    bioInput.value = nurseData.bio || "";
    aboutInput.value = nurseData.about || "";
    specializationInput.value = nurseData.specialization || "";
    photoPreview.src =
      nurseData.photo ||
      "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png";
  }

  uploadButton.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        photoPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("addQualification").addEventListener("click", () => {
    const qualificationsContainer = document.getElementById(
      "qualificationsContainer"
    );
    const qualificationGroup = document.createElement("div");
    qualificationGroup.classList.add("form-group");
    qualificationGroup.innerHTML = `
          <input type="text" placeholder="Título" />
          <input type="text" placeholder="Universidad" />
          <input type="date" placeholder="Fecha de Inicio" />
          <input type="date" placeholder="Fecha de Fin" />
          <button type="button" class="delete-btn delete-button">Eliminar</button>
        `;
    qualificationsContainer.appendChild(qualificationGroup);

    qualificationGroup
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        qualificationGroup.remove();
      });
  });

  document.getElementById("addExperience").addEventListener("click", () => {
    const experiencesContainer = document.getElementById(
      "experiencesContainer"
    );
    const experienceGroup = document.createElement("div");
    experienceGroup.classList.add("form-group");
    experienceGroup.innerHTML = `
          <input type="text" placeholder="Cargo" />
          <input type="text" placeholder="Hospital" />
          <input type="date" placeholder="Fecha de Inicio" />
          <input type="date" placeholder="Fecha de Fin" />
          <button type="button" class="delete-btn delete-button">Eliminar</button>
        `;
    experiencesContainer.appendChild(experienceGroup);

    experienceGroup
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        experienceGroup.remove();
      });
  });

  document.getElementById("addService").addEventListener("click", () => {
    const timeSlotsContainer = document.getElementById("timeSlotsContainer");
    const timeSlotGroup = document.createElement("div");
    timeSlotGroup.classList.add("form-group");
    timeSlotGroup.innerHTML = `
          <input type="text" placeholder="Título del Servicio" />
          <textarea placeholder="Descripción del Servicio"></textarea>
          <button type="button" class="delete-btn delete-button">Eliminar</button>
        `;
    timeSlotsContainer.appendChild(timeSlotGroup);

    timeSlotGroup.querySelector(".delete-btn").addEventListener("click", () => {
      timeSlotGroup.remove();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const file = photoInput.files[0];
    if (file) {
      formData.append("photo", file);
    }

    const qualifications = [];
    document
      .querySelectorAll("#qualificationsContainer .form-group")
      .forEach((group) => {
        const degree = group.querySelector("input[placeholder='Título']").value;
        const university = group.querySelector(
          "input[placeholder='Universidad']"
        ).value;
        const startingDate = group.querySelector(
          "input[placeholder='Fecha de Inicio']"
        ).value;
        const endingDate = group.querySelector(
          "input[placeholder='Fecha de Fin']"
        ).value;
        if (degree && university && startingDate && endingDate) {
          qualifications.push({ degree, university, startingDate, endingDate });
        }
      });
    formData.append("education", JSON.stringify(qualifications));

    const experiences = [];
    document
      .querySelectorAll("#experiencesContainer .form-group")
      .forEach((group) => {
        const position = group.querySelector(
          "input[placeholder='Cargo']"
        ).value;
        const hospital = group.querySelector(
          "input[placeholder='Hospital']"
        ).value;
        const startingDate = group.querySelector(
          "input[placeholder='Fecha de Inicio']"
        ).value;
        const endingDate = group.querySelector(
          "input[placeholder='Fecha de Fin']"
        ).value;
        if (position && hospital && startingDate && endingDate) {
          experiences.push({ position, hospital, startingDate, endingDate });
        }
      });
    formData.append("experiences", JSON.stringify(experiences));

    const services = [];
    document
      .querySelectorAll("#timeSlotsContainer .form-group")
      .forEach((group) => {
        const title = group.querySelector(
          "input[placeholder='Título del Servicio']"
        ).value;
        const description = group.querySelector(
          "textarea[placeholder='Descripción del Servicio']"
        ).value;

        if (title && description) {
          services.push({ title, description });
        }
      });
    formData.append("services", JSON.stringify(services));

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/v1/nurses/${nurseData._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status && result.nurse) {
        localStorage.setItem("user", JSON.stringify(result.nurse));
        Toastify({
          text: "Perfil actualizado con éxito",
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
          text: `${result.message || "Error desconocido"}`,
          duration: 1000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      Toastify({
        text: "Error al actualizar el perfil",
        duration: 1000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
      }).showToast();
    }
  });
});
