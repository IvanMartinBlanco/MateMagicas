import { getSessionData } from '../js/session.js';

window.onload = function () {
    let rol;
    let message;
    let title;
    switch (getSessionData().rol) {
        case "administrador":
            rol = "ADMIN";
            break;
        case "tutor":
            rol = "TUTOR";
            break;
        case "alumno":
            rol = "STUDENT";
            break;
        default:
            rol = "VISITOR";
    }
    fetch(`http://localhost/web/back/public/help?rol=${rol}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(constants => {
            title = constants.title;
            message = constants.message;

            document.getElementById("title").innerHTML = title;
            document.getElementById("message").innerHTML = message;
        });
};