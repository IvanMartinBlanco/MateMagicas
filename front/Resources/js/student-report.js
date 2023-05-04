import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
    // Verificamos si el usuario tiene rol de "tutor" al cargar la página.
    if (getSessionData()?.rol !== 'tutor') {
        // Redirigimos a otra página.
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    // Obtenemos elementos del formulario y otras secciones.
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
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
        if (emailInput.value.trim() === '') {
            showError(emailInput, '*El correo electrónico es obligatorio');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
            showError(emailInput, '*El correo electrónico no es válido');
            isValid = false;
        } else {
            hideError(emailInput);
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
                'email': emailInput.value.trim()
            };
            // Realizamos una petición GET al servidor, en la URL especificada.
            fetch(`http://localhost/web/back/public/searchstudent?id=${formData.id}&email=${formData.email}`)
                .then(response => {
                    // Si la respuesta no es buena, lanzamos un error.
                    if (!response.ok) {
                        serverMessage.textContent = "Error en la respuesta del servidor";
                    }
                    // Redirigimos a la página de estadísticas del alumno.
                    window.location.href = `./report.html?email=${formData.email}`;
                })
                .then(data => {
                    // Quitamos los mensajes de error del servidor.
                    if (data.success) {
                        serverMessage.textContent = "";
                    } else {
                        // Mostramos el mensaje del servidor.
                        serverMessage.textContent = data.message;
                    }
                })
                // Controlamos si ha habido un error en el servidor.
                .catch(error => {
                    console.error(error);
                });
        }
    });
});