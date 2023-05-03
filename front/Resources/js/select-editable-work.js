import { setSessionData, getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    const form = document.querySelector('form');
    const idInput = document.querySelector('#id');
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
        if (idInput.value.trim() !== '' && idInput.value.trim() < 1) {
            showError(idInput, '*El número debe ser mayor o igual a 1');
            isValid = false;
        } else {
            hideError(idInput);
        }
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': getSessionData().id,
                'workId': idInput.value.trim()
            };
            fetch(`http://localhost/web/back/public/editablework?id=${formData.id}&workId=${formData.workId}`)
                .then(response => response.json())
                .then(data => {
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


    function editVariable(variables, id) {
        window.location.href = 'edit-work.html?variable=' + variables + '&work=' + id;
    }


});