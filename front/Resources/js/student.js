import { setSessionData, getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si el usuario tiene rol de "alumno" al cargar la página.
  if (getSessionData()?.rol !== 'alumno') {
    // Redirigimos a otra página.
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  // Obtenemos el enlace de cerrar sesión.
  const closeSessionLink = document.querySelector('#close');
  // Agregamos un listener al enlace de cerrar sesión.
  closeSessionLink.addEventListener('click', () => {
    setSessionData(null, null, null, false);
    window.location.replace('../pages/index.html');
  });
});