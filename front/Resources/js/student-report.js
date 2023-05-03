import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'tutor') {
        // Redirigir a otra página
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const serverMessage = document.querySelector('#server-message');

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


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': getSessionData().id,
                'email': emailInput.value.trim()
            };
            fetch(`http://localhost/web/back/public/searchstudent?id=${formData.id}&email=${formData.email}`)
                .then(response => {
                    if (!response.ok) {
                        serverMessage.textContent = "Error en la respuesta del servidor";
                    }
                    window.location.href = `./report.html?email=${formData.email}`;
                })
                .then(data => {
                    if (data.success) {
                        serverMessage.textContent = "";
                    } else {
                        serverMessage.textContent = data.message;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });

});