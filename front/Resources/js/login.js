import { setSessionData, getSessionData } from '../js/session.js';

// Usamos este .js cuando esté cargado todo el DOM.
$(document).ready(function () {
  // Verificamos si el usuario está registrado.
  if (getSessionData()?.registeredUser) {
    // Redirigimos a otra página.
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  // Agregamos un evento de escucha al botón del formulario para enviar una petición POST a la API.
  $('#login-form').submit(function (event) {
    // Evitar el comportamiento por defecto del formulario
    event.preventDefault();
    const username = $('#email').val();
    const password = $('#password').val();
    // Realizamos una petición POST al servidor, en la URL especificada.
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
          // Si la respuesta es satisfactoria, la convertimos a JSON.
          if (response.ok) {
          document.getElementById("unauthorized").textContent = "";
          return response.json();
        } else {
          // Si la respuesta no es buena, lanzamos un error.
          throw new Error('Error en la respuesta del servidor');
        }
      })
      .then(data => {
        // Cargamos los valores obtenidos del servidor en las variables de sesión.
        setSessionData(data.id, data.name, data.rol);
        window.location.replace('../pages/index.html');
      })
      // Controlamos si ha habido un error en el servidor.
      .catch(() => {
        document.getElementById("unauthorized").textContent = "*Usuario o contraseña incorrectos";
      });
  });
});