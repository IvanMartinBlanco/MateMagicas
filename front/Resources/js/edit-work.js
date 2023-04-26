import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("../../../front/pages/index.html");
    }
// Obtener el número de resultados de la base de datos
let numResultados = 10;

// Obtener el elemento del DOM donde se van a añadir los campos
let contenedorCampos = document.getElementById('variables-container');

// Bucle para crear los campos
for (let i = 1; i <= numResultados; i++) {
  // Crear el elemento div
  let variableDiv = document.createElement('div');
  
  // Crear el elemento label
  let label = document.createElement('label');
  label.innerHTML = 'Variable ' + i + ':';
  label.setAttribute('for', 'variable-' + i);
  
  // Crear el elemento input
  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'variable-' + i);
  input.setAttribute('name', 'variable-' + i);
  input.setAttribute('required', '');
  
  // Crear el elemento div para el mensaje de error
  let errorDiv = document.createElement('div');
  errorDiv.setAttribute('class', 'error-message');
  
  // Añadir los elementos al div contenedor
  variableDiv.appendChild(label);
  variableDiv.appendChild(input);
  variableDiv.appendChild(errorDiv);
  
  // Añadir el div contenedor al elemento padre del DOM
  contenedorCampos.appendChild(variableDiv);
}
    // Evento para cerrar la ventana modal al hacer clic en el botón "Cerrar"
    const closeModal = document.getElementById("cerrarModal");
    closeModal.addEventListener("click", function () {
        const miModal = document.getElementById("modal");
        miModal.style.display = "none";
        form.reset();
        subjectInput.disabled = true;
    });
});