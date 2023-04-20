document.addEventListener("DOMContentLoaded", function() {
const form = document.querySelector('form');
const userNameInput = document.querySelector('#user-name');
const surnamesInput = document.querySelector('#surnames');
const ageInput = document.querySelector('#age');
const emailInput = document.querySelector('#email');
const emailRepeatInput = document.querySelector('#email-repeat');
const passwordInput = document.querySelector('#password');
const passwordRepeatInput = document.querySelector('#password-repeat');
const rolInput = document.querySelector('#rol');
const tutorInput = document.querySelector('#tutor');
const courseInput = document.querySelector('#course');

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
  } else if (ageInput.value.trim()<1 || ageInput.value.trim() >120) {
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
  if (checkInputs()) {
    const formData = {
      'user-name': userNameInput.value.trim(),
      'surnames': surnamesInput.value.trim(),
      'age': ageInput.value.trim() !== '' ? ageInput.value.trim() : null, // Si está vacío, se envía null
      'email': emailInput.value.trim(),
      'email-repeat': emailRepeatInput.value.trim(),
      'password': passwordInput.value.trim(),
      'password-repeat': passwordRepeatInput.value.trim(),
      'rol': rolInput.value.trim(),
      'tutor': tutorInput.value.trim() !== '' ? tutorInput.value.trim() : null, // Si está vacío, se envía null
      'course': courseInput.value.trim()
    };
    fetch("http://localhost/web/back/public/createuser", {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      const serverMessage = document.querySelector('.server-message');
      if(data.success){
        serverMessage.textContent = "";
      }else{
        serverMessage = document.querySelector('.server-message');
        serverMessage.textContent = data.message;
    isValid = false;
      }
      form.reset();
    })
    .catch((error) => {
      console.log(error)
      alert('Ha ocurrido un error al crear el usuario');
    });
  }
});

});