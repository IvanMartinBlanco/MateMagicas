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
    const idInput = document.querySelector('#id');
    const serverMessage = document.querySelector('#server-message');

    // Función para mostrar mensaje de error.
    const showError = (input, message) => {
        const errorContainer = input.parentElement;
        const errorMessage = errorContainer.querySelector('.error-message');
        input.classList.add('error');
        errorMessage.textContent = message;
    };
    // Función para ocultar mensaje de error.
    const hideError = (input) => {
        const errorContainer = input.parentElement;
        const errorMessage = errorContainer.querySelector('.error-message');
        input.classList.remove('error');
        errorMessage.textContent = '';
    };

    // Validamos los campos del formulario.
    const checkInputs = () => {
        let isValid = true;
        if (idInput.value.trim() !== '' && idInput.value.trim() < 1) {
            showError(idInput, '*El número debe ser mayor o igual a 1');
            isValid = false;
        } else {
            hideError(idInput);
        }
        return isValid;
    };

    // Agregamos un evento de escucha al botón del formulario para enviar una petición GET a la API.
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': getSessionData().id,
                'workId': idInput.value.trim()
            };
            // Realizamos una petición GET al servidor, en la URL especificada.
            fetch(`http://localhost/web/back/public/editablework?id=${formData.id}&workId=${formData.workId}`)
                // Si la respuesta es satisfactoria, la convertimos a JSON.
                .then(response => response.json())
                .then(data => {
                    // Enviamos los datos obtenidos del servidor en una llamada a un método que hará el redireccionamiento.
                    if (!data.error) {
                        serverMessage.textContent = "";
                        editVariable(data.scalar, formData.workId);
                    } else {
                        serverMessage.textContent = data.error;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });

    //Desde esta función haremos la redirección a otra página mandando los datos para ser tratados allí.
    function editVariable(variables, id) {
        window.location.href = 'edit-work.html?variable=' + variables + '&work=' + id;
    }
});