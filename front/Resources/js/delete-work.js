import { setSessionData, getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("../../../front/pages/index.html");
    }
    const form = document.querySelector('form');
    const workInput = document.querySelector('#code');
    const serverMessage = document.querySelector('#server-message');
    const userId = getSessionData().id;

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
        const codeValue = Number(workInput.value.trim()); // convierte el valor de la entrada a un número
        if (isNaN(codeValue) || codeValue < 1) {
            showError(workInput, '*El número debe ser un número mayor o igual a 1');
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
                'id': userId,
                'workId': parseInt(workInput.value.trim()),
            };
            fetch("http://localhost/web/back/public/deletework", {
                method: 'DELETE',
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
                    alert('Ha ocurrido un error al borrar el ejercicio');
                });
        }
    });
    // Evento para cerrar la ventana modal al hacer clic en el botón "Cerrar"
    const closeModal = document.getElementById("cerrarModal");
    closeModal.addEventListener("click", function () {
        const miModal = document.getElementById("modal");
        miModal.style.display = "none";
        location.reload();
    });

});