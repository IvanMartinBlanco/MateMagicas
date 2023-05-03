import { setSessionData, getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'tutor') {
        // Redirigir a otra página
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    const form = document.querySelector('form');
    const userNameInput = document.querySelector('#user-name');
    const surnamesInput = document.querySelector('#surnames');
    const ageInput = document.querySelector('#age');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const passwordRepeatInput = document.querySelector('#password-repeat');
    const tutorInput = document.querySelector('#tutor');
    const courseInput = document.querySelector('#course');
    const serverMessage = document.querySelector('#server-message');
    const userId = getSessionData().id;


    fetch(`http://localhost/web/back/public/user?id=${userId}`)
        .then(response => {
            if (!response.ok) {
                serverMessage.textContent = "Error en la respuesta del servidor";
            }
            return response.json();
        })
        .then(data => {
            userNameInput.value = data.Nombre;
            surnamesInput.value = data.Apellidos;
            ageInput.value = data.Edad;
            emailInput.value = data.CorreoElectronico;
            tutorInput.value = data.IdTutor;
            courseInput.value = data.Curso;
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
        if (userNameInput.value.trim() === '') {
            showError(userNameInput, '*El nombre es obligatorio');
            isValid = false;
        } else {
            hideError(userNameInput);
        }
        if (surnamesInput.value.trim() === '') {
            showError(surnamesInput, '*Los apellidos son obligatorios');
            isValid = false;
        } else {
            hideError(surnamesInput);
        }
        if (ageInput.value.trim() === '') {
            showError(ageInput, '*La edad es obligatoria');
            isValid = false;
        } else if (ageInput.value.trim() < 1 || ageInput.value.trim() > 120) {
            showError(ageInput, '*La edad debe estar comprendida entre 1 y 120');
            isValid = false;
        } else {
            hideError(ageInput);
        }
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, '*La contraseña es obligatoria');
            isValid = false;
        } else {
            hideError(passwordInput);
        }
        if (passwordRepeatInput.value.trim() === '') {
            showError(passwordRepeatInput, '*Debe repetir la contraseña');
            isValid = false;
        } else if (passwordInput.value.trim() !== passwordRepeatInput.value.trim()) {
            showError(passwordRepeatInput, '*Las contraseñas no coinciden');
            isValid = false;
        } else {
            hideError(passwordRepeatInput);
        }
        if (tutorInput.value.trim() !== '' && tutorInput.value.trim() < 1) {
            showError(tutorInput, '*El número debe ser mayor o igual a 1');
            isValid = false;
        } else {
            hideError(tutorInput);
        }
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        serverMessage.textContent = "";
        if (checkInputs()) {
            const formData = {
                'id': userId,
                'user-name': userNameInput.value.trim(),
                'surnames': surnamesInput.value.trim(),
                'age': ageInput.value.trim() !== '' ? ageInput.value.trim() : null, // Si está vacío, se envía null
                'email': emailInput.value.trim(),
                'password': passwordInput.value.trim(),
                'password-repeat': passwordRepeatInput.value.trim(),
                'tutor': tutorInput.value.trim(), // Si está vacío, se envía null
                'course': courseInput.value.trim()
            };
            fetch("http://localhost/web/back/public/edittutor", {
                method: 'PUT',
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        serverMessage.textContent = "";
                        setSessionData(getSessionData().id, formData['user-name'], getSessionData()?.rol);
                        // Si la respuesta del servidor es exitosa, se muestra la ventana modal
                        const miModal = document.getElementById("modal");
                        miModal.style.display = "block";
                    } else {
                        serverMessage.textContent = data.message;
                    }
                })
                .catch((error) => {
                    console.log(error)
                    alert('Ha ocurrido un error al modificar el usuario');
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