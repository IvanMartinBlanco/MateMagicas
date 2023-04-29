import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'alumno' && getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("../../../front/pages/login.html");
      }
    

});