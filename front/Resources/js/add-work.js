import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("../../../front/pages/index.html");
    }
    const form = document.querySelector('form');
    const workInput = document.querySelector('#work');
    const serverMessage = document.querySelector('#server-message');
    const etapaInput = document.getElementById("stage");
    const subjectInput = document.getElementById("subject");
    const nameInput = document.getElementById("name");
    const levelInput = document.getElementById("level");

    // Agregar evento de escucha al selector de etapas
    etapaInput.addEventListener("change", function () {
        // Obtener valor seleccionado
        const stage = etapaInput.value;
        // Habilitar el selector de asignaturas
        subjectInput.disabled = false;


        // Rellenar el selector de asignaturas según la etapa seleccionada
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
            nameInput.disabled = true;
            levelInput.disabled = true;
            nameInput.value="";
            subjectInput.title = "Seleccione primero una etapa.";
            nameInput.title = "Seleccione primero la asignatura.";
            levelInput.title = "Seleccione primero el nombre del ejercicio.";
            levelInput.value = 1;
            subjectInput.innerHTML = `
    <option value="">Seleccione asignatura</option>
  `;
        }
    });
    // Agregar evento de escucha al selector de etapas
    subjectInput.addEventListener("change", function () {
        if (subjectInput.value !== "start") {

            nameInput.title = "Seleccione un nombre para el ejercicio.";
            nameInput.disabled = false;
        } else {
            nameInput.title = "Seleccione primero la asignatura.";
            nameInput.disabled = true;
            nameInput.value="";
            levelInput.title = "Seleccione primero el nombre del ejercicio.";
            levelInput.disabled = true;
            levelInput.value = 1;
        }
    });
    nameInput.addEventListener("change", function () {
        if (nameInput.value !== "") {
            levelInput.title = "Selecciona un nivel de dificultad.";
            levelInput.disabled = false;
        } else {
            levelInput.title = "Seleccione primero el nombre del ejercicio.";
            levelInput.disabled = true;
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
        if (workInput.value.trim() !== '' && workInput.value.trim() < 1) {
            showError(workInput, '*El número debe ser mayor o igual a 1');
            isValid = false;
        } else {
            hideError(workInput);
        }
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': getSessionData().id,
                'work': workInput.value.trim()
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
                    alert('Ha ocurrido un error al borrar el usuario');
                });
        }
    });

    // Evento para cerrar la ventana modal al hacer clic en el botón "Cerrar"
    const closeModal = document.getElementById("cerrarModal");
    closeModal.addEventListener("click", function () {
        const miModal = document.getElementById("modal");
        miModal.style.display = "none";
    });


});