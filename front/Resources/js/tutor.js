import { setSessionData, getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol!=='tutor') {
      // Redirigir a otra página
      window.location.replace("../../../front/pages/index.html");
    }
    const closeSessionLink = document.querySelector('#close');

    closeSessionLink.addEventListener('click', () => {
      setSessionData(null,null,null,false);
      window.location.replace('../pages/index.html');
    });
  });