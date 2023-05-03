import { setSessionData, getSessionData } from '../js/session.js';

$(document).ready(function() {
  if (getSessionData()?.registeredUser) {
    // Redirigir a otra página
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  // Escuchar el evento submit del formulario de inicio de sesión
  $('#login-form').submit(function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    // Obtener los datos del formulario de inicio de sesión
    const username = $('#email').val();
    const password = $('#password').val();
    // Realizar una solicitud AJAX para iniciar sesión
    fetch('http://localhost/web/back/public/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        document.getElementById("unauthorized").textContent = "";
        return response.json();
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    })
    .then(data => {
      setSessionData(data.id, data.name, data.rol);
      window.location.replace('../pages/index.html');
    })
    .catch(() => {
      // Hubo un error al recibir la respuesta
      document.getElementById("unauthorized").textContent = "*Usuario o contraseña incorrectos";
    });
  });
});