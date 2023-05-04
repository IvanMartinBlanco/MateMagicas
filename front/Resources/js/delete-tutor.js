import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
    // Verificamos si el usuario tiene rol de "administrador" al cargar la página.
    if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'administrador') {
        // Redirigimos a otra página.
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    // Obtenemos elementos del formulario y otras secciones.
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const serverMessage = document.querySelector('#server-message');
    const apiURL = getSessionData()?.rol === 'administrador' ? "http://localhost/web/back/public/deletetutor" : "http://localhost/web/back/public/deleteuser";
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

    // Agregamos un evento de escucha al botón del formulario para enviar una petición DELETE a la API.
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': getSessionData().id,
                'email': emailInput.value.trim()
            };
            // Realizamos una petición DELETE al servidor, en la URL especificada.
            fetch(apiURL, {
                method: 'DELETE',
                body: JSON.stringify(formData)
            })
                // Si la respuesta es satisfactoria, la convertimos a JSON.
                .then(response => response.json())
                .then(data => {
                    // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
                    if (data.success) {
                        serverMessage.textContent = "";
                        // Si la respuesta del servidor es exitosa, se muestra la ventana modal
                        const miModal = document.getElementById("modal");
                        miModal.style.display = "block";
                    } else {
                        serverMessage.textContent = data.message;
                    }
                })
                // Controlamos si ha habido un error en el servidor.
                .catch((error) => {
                    console.log(error)
                    alert('Ha ocurrido un error al borrar el usuario');
                });
        }
    });

    // Agregamos un evento de escucha al botón de cerrar la modal para ocultarlo cuando se pulse.
    closeModal.addEventListener("click", function () {
        const miModal = document.getElementById("modal");
        miModal.style.display = "none";
        closeSession();
    });
});