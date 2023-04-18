document.addEventListener("DOMContentLoaded", function() {
const form = document.querySelector('form');
const userNameInput = document.querySelector('#user-name');
const surnamesInput = document.querySelector('#surnames');
const ageInput = document.querySelector('#age');
const emailInput = document.querySelector('#email');
const emailRepeatInput = document.querySelector('#email-repeat');
const passwordInput = document.querySelector('#password');
const passwordRepeatInput = document.querySelector('#password-repeat');
const button = document.querySelector('#button-container');

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


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (checkInputs()) {
    const formData = {
      'user-name': document.getElementById('user-name').value,
      'surnames': document.getElementById('surnames').value,
      'age': document.getElementById('age').value,
      'email': document.getElementById('email').value,
      'email-repeat': document.getElementById('email').value,
      'password': document.getElementById('password').value,
      'password-repeat': document.getElementById('password').value,
      'rol': document.getElementById('rol').value,
      'tutor': document.getElementById('tutor').value,
      'course': document.getElementById('course').value
    };
    fetch("http://localhost/web/back/public/createuser", {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if(data.success){

      }else{
        const serverMessage = document.querySelector('.server-message');
        serverMessage.textContent = data.message;
    isValid = false;
      }
      form.reset();
    })
    .catch(() => {
      alert('Ha ocurrido un error al crear el usuario');
    });
  }
});

});