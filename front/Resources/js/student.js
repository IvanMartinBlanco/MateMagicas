import { setSessionData, getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol!=='alumno') {
      // Redirigir a otra página
      window.location.replace("http://localhost/web/front/pages/index.html");
    }
    const closeSessionLink = document.querySelector('#close');

    closeSessionLink.addEventListener('click', () => {
      setSessionData(null,null,null,false);
      window.location.replace('../pages/index.html');
    });
  });