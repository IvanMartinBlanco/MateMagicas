import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
  if (getSessionData()?.rol !== 'administrador') {
    // Redirigir a otra página
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  const form = document.querySelector('form');
  // Obtener el número de resultados de la base de datos

  // Obtener la cadena de consulta de la URL actual
  const queryString = window.location.search;

  // Analizar la cadena de consulta para obtener los parámetros
  const params = new URLSearchParams(queryString);

  // Obtener el valor del parámetro "variable"
  const variableValue = params.get('variable');

  // Obtener el valor del parámetro "work"
  const workId = params.get('work');
  const serverMessage = document.querySelector('#server-message');
  const formData = {};
  let contenedorCampos = document.getElementById('variables-container');

  let variableInputs = [];
  // Bucle para crear los campos
  for (let i = 1; i <= variableValue; i++) {
    // Crear el elemento div
    let variableDiv = document.createElement('div');
    let variableSpan = document.createElement('span');
    variableSpan.setAttribute('class', 'input-container')

    // Crear el elemento label
    let label = document.createElement('label');
    label.innerHTML = 'Variable ' + i + ':';
    let variableName = 'variable-' + i;
    label.setAttribute('for', variableName);

    // Crear el elemento input
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('id', variableName);
    input.setAttribute('name', variableName);
    input.setAttribute('required', '');
    input.setAttribute('class', 'little-input');

    // Crear el elemento div para el mensaje de error
    let errorDiv = document.createElement('div');
    errorDiv.setAttribute('class', 'error-message');

    variableDiv.appendChild(label);
    variableSpan.appendChild(input);
    variableSpan.appendChild(errorDiv);
    variableDiv.appendChild(variableSpan);


    contenedorCampos.appendChild(variableDiv);
    const variableInput = document.querySelector('#' + variableName);
    variableInputs.push(variableInput);

  }


  let variableIds = [];

  // Llamada al primer fetch
  fetch(`http://localhost/web/back/public/work?id=${workId}`)
    .then(response => {
      if (!response.ok) {
        serverMessage.textContent = "Error en la respuesta del servidor";
      }
      return response.json();
    })
    .then(data => {
      const sortedData = Object.entries(data)
        .sort((a, b) => a[0] - b[0])
        .map(entry => entry[1]);
      variableInputs.forEach((input, index) => {
        const inputValue = sortedData[index] || "";
        input.value = inputValue;

        // Guardar el ID de la variable correspondiente en el array
        variableIds.push(Object.keys(data)[index]);
      });
    })
    .catch(error => {
      console.error(error);
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
    variableInputs.forEach(input => {
      const value = input.value.trim();
      if (value === '') {
        showError(input, '* Este campo es obligatorio');
        isValid = false;
      } else if (isNaN(value)) {
        showError(input, '* El valor debe ser numérico');
        isValid = false;
      } else {
        hideError(input);
      }
    });
    return isValid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serverMessage.textContent = "";
    if (checkInputs()) {
      const data = {};
      variableInputs.forEach((input, index) => {
        const id = variableIds[index];
        data[id] = input.value;
      });
      fetch('http://localhost/web/back/public/editvariable', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          id: workId
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            serverMessage.textContent = "";                  // Si la respuesta del servidor es exitosa, se muestra la ventana modal
            const miModal = document.getElementById("modal");
            miModal.style.display = "block";
          } else {
            serverMessage.textContent = data.message;
          }
        })
        .catch(error => console.error(error));
    }
  });


  // Evento para cerrar la ventana modal al hacer clic en el botón "Cerrar"
  const closeModal = document.getElementById("cerrarModal");
  closeModal.addEventListener("click", function () {
    const miModal = document.getElementById("modal");
    window.location.href = './select-editable-work.html';
  });
});