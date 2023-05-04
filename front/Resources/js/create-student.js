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
  const userNameInput = document.querySelector('#user-name');
  const surnamesInput = document.querySelector('#surnames');
  const ageInput = document.querySelector('#age');
  const emailInput = document.querySelector('#email');
  const emailRepeatInput = document.querySelector('#email-repeat');
  const passwordInput = document.querySelector('#password');
  const passwordRepeatInput = document.querySelector('#password-repeat');
  const tutorInput = document.querySelector('#tutor');
  const courseInput = document.querySelector('#course');
  const serverMessage = document.querySelector('#server-message');
  const userId = getSessionData().id;
  const closeModal = document.getElementById("cerrarModal");

  // Realiza una petición GET para obtener los datos del usuario actual.
  fetch(`http://localhost/web/back/public/user?id=${userId}`)
    .then(response => {
      // Si la respuesta no es buena, lanzamos un error.
      if (!response.ok) {
        serverMessage.textContent = "Error en la respuesta del servidor";
      }
      // Convierte los datos recibidos a un objeto JSON.
      return response.json();
    })
    .then(data => {
      // Guardamos los valores obtenidos del servidor en la variable declarada anteriormente.
      tutorInput.value = data.IdTutor;
    })
    // Controlamos si ha habido un error en el servidor.
    .catch(error => {
      console.error(error);
    });

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
    if (emailInput.value.trim() === '') {
      showError(emailInput, '*El correo electrónico es obligatorio');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
      showError(emailInput, '*El correo electrónico no es válido');
      isValid = false;
    } else {
      hideError(emailInput);
    }
    if (emailRepeatInput.value.trim() === '') {
      showError(emailRepeatInput, '*Debe repetir el correo electrónico');
      isValid = false;
    } else if (emailInput.value.trim() !== emailRepeatInput.value.trim()) {
      showError(emailRepeatInput, '*Los correos electrónicos no coinciden');
      isValid = false;
    } else {
      hideError(emailRepeatInput);
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
    return isValid;
  };
  // Agregamos un evento de escucha al botón del formulario para enviar una petición POST a la API.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serverMessage.textContent = "";
    if (checkInputs()) {
      const formData = {
        'user-name': userNameInput.value.trim(),
        'surnames': surnamesInput.value.trim(),
        'age': ageInput.value.trim() !== '' ? ageInput.value.trim() : null,
        'email': emailInput.value.trim(),
        'email-repeat': emailRepeatInput.value.trim(),
        'password': passwordInput.value.trim(),
        'password-repeat': passwordRepeatInput.value.trim(),
        'tutor': tutorInput.value.trim(),
        'course': courseInput.value.trim()
      };
      // Realizamos una petición POST al servidor, en la URL especificada.
      fetch("http://localhost/web/back/public/createstudent", {
        method: 'POST',
        body: JSON.stringify(formData)
      })
        // Si la respuesta es satisfactoria, la convertimos a JSON.
        .then(response => response.json())
        .then(data => {
          // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
          if (data.success) {
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
          alert('Ha ocurrido un error al crear el usuario');
        });
    }
  });

  // Agregamos un evento de escucha al botón de cerrar la modal para ocultarlo cuando se pulse.
  closeModal.addEventListener("click", function () {
    const miModal = document.getElementById("modal");
    miModal.style.display = "none";
  });
});