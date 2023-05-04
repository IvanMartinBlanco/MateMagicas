import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si el usuario tiene rol de "administrador" al cargar la página.
  if (getSessionData()?.rol !== 'administrador') {
    // Redirigimos a otra página.
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  // Obtenemos elementos del formulario y otras secciones.
  const form = document.querySelector('form');
  const serverMessage = document.querySelector('#server-message');
  const idInput = document.getElementById("id");
  const stageInput = document.getElementById("stage");
  const subjectInput = document.getElementById("subject");
  const nameInput = document.getElementById("name");
  const levelInput = document.getElementById("level");

  // Agregamos un evento de escucha al selector de etapas.
  stageInput.addEventListener("change", function () {
    // Obtenemos el valor seleccionado.
    const stage = stageInput.value;
    // Habilitamos el selector de asignaturas.
    subjectInput.disabled = false;
    // Rellenamos el selector de asignaturas según la etapa seleccionada.
    if (stage === "primary") {
      subjectInput.title = "Seleccione la asignatura de primaria.";
      subjectInput.innerHTML = `
      <option value="start">Seleccione asignatura</option>
      <option value="numeros">Números</option>
      <option value="figuras">Figuras</option>
      <option value="calculo">Cálculo</option>
      `;
    } else if (stage === "secondary") {
      subjectInput.title = "Seleccione la asignatura de secundaria.";
      subjectInput.innerHTML = `
      <option value="start">Seleccione asignatura</option>
      <option value="arithmetic">Aritmética</option>
      <option value="algebra">Álgebra</option>
      <option value="geometry">Geometría</option>
      `;
    } else if (stage === "advanced") {
      subjectInput.title = "Seleccione la asignatura avanzada.";
      subjectInput.innerHTML = `
      <option value="start">Seleccione asignatura</option>
      <option value="analysis">Análisis</option>
      <option value="linear-algebra">Álgebra lineal</option>
      <option value="advanced-geometry">Geometría</option>
      `;
    } else {
      subjectInput.disabled = true;
      subjectInput.title = "Seleccione primero una etapa.";
      subjectInput.innerHTML = `
    <option value="">Seleccione asignatura</option>
  `;
    }
  });
  const showError = (input, message) => {
    const errorContainer = input.parentElement;
    const errorMessage = errorContainer.querySelector('.error-message');
    input.classList.add('error');
    errorMessage.textContent = message;
  };

  const hideError = (input) => {
    const errorContainer = input.parentElement;
    const errorMessage = errorContainer.querySelector('.error-message');
    input.classList.remove('error');
    errorMessage.textContent = '';
  };

  const checkInputs = () => {
    let isValid = true;
    if (idInput.value.trim() !== '' && idInput.value.trim() < 1) {
      showError(idInput, '*El número debe ser mayor o igual a 1');
      isValid = false;
    } else {
      hideError(idInput);
    }
    if (stageInput.selectedOptions[0].textContent === 'Selecciona etapa') {
      showError(stageInput, '*La etapa es obligatoria');
      isValid = false;
    } else {
      hideError(stageInput);
    }
    if (subjectInput.selectedOptions[0].textContent === 'Selecciona asignatura') {
      showError(subjectInput, '*La asignatura es obligatoria');
      isValid = false;
    } else {
      hideError(subjectInput);
    }
    if (nameInput.value.trim() === '') {
      showError(nameInput, '*El nombre es obligatorio');
      isValid = false;
    } else {
      hideError(nameInput);
    }
    if (levelInput.selectedOptions[0].textContent !== '1' && levelInput.selectedOptions[0].textContent !== '2' && levelInput.selectedOptions[0].textContent !== '3') {
      showError(levelInput, '*El nivel debe ser 1, 2 o 3');
      isValid = false;
    } else {
      hideError(levelInput);
    }
    return isValid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serverMessage.textContent = "";
    if (checkInputs()) {
      const formData = {
        'id': getSessionData().id,
        'workId': parseInt(idInput.value.trim()),
        'stage': stageInput.selectedOptions[0].textContent,
        'subject': subjectInput.selectedOptions[0].textContent,
        'name': nameInput.value.trim(),
        'level': parseInt(levelInput.selectedOptions[0].textContent),
      };
      fetch("http://localhost/web/back/public/creatework", {
        method: 'POST',
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            serverMessage.textContent = "";
            // Si la respuesta del servidor es exitosa, se muestra la ventana modal
            const miModal = document.getElementById("modal");
            miModal.style.display = "block";
          } else {
            serverMessage.textContent = data.message;
          }
        })
        .catch((error) => {
          console.log(error)
          alert('Ha ocurrido un error al añadir el ejercicio');
        });
    }
  });

  // Evento para cerrar la ventana modal al hacer clic en el botón "Cerrar"
  const closeModal = document.getElementById("cerrarModal");
  closeModal.addEventListener("click", function () {
    const miModal = document.getElementById("modal");
    miModal.style.display = "none";
    form.reset();
    subjectInput.disabled = true;
  });
});