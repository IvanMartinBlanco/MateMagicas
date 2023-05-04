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
    const workInput = document.querySelector('#code');
    const serverMessage = document.querySelector('#server-message');
    const userId = getSessionData().id;
    const closeModal = document.getElementById("cerrarModal");

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
        const codeValue = Number(workInput.value.trim()); // convierte el valor de la entrada a un número
        if (isNaN(codeValue) || codeValue < 1) {
            showError(workInput, '*El número debe ser un número mayor o igual a 1');
            isValid = false;
        } else {
            hideError(workInput);
        }
        return isValid;
    };
    // Agregamos un evento de escucha al botón del formulario para enviar una petición DELETE a la API.
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': userId,
                'workId': parseInt(workInput.value.trim()),
            };
            // Realizamos una petición DELETE al servidor, en la URL especificada.
            fetch("http://localhost/web/back/public/deletework", {
                method: 'DELETE',
                body: JSON.stringify(formData)
            })
                // Si la respuesta es satisfactoria, la convertimos a JSON.
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
                        serverMessage.textContent = "";
                        const miModal = document.getElementById("modal");
                        miModal.style.display = "block";
                    } else {
                        serverMessage.textContent = data.message;
                    }
                })
                // Controlamos si ha habido un error en el servidor.
                .catch((error) => {
                    console.log(error)
                    alert('Ha ocurrido un error al borrar el ejercicio');
                });
        }
    });

    // Agregamos un evento de escucha al botón de cerrar la modal para ocultarlo cuando se pulse.
    closeModal.addEventListener("click", function () {
        const miModal = document.getElementById("modal");
        miModal.style.display = "none";
        location.reload();
    });
});