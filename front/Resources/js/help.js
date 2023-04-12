import { getSessionData } from '../js/session.js';
import { VISITOR_MESSAGE, VISITOR_TITLE, STUDENT_MESSAGE, STUDENT_TITLE, TUTOR_MESSAGE, TUTOR_TITLE, ADMIN_MESSAGE, ADMIN_TITLE } from './constants.js';


window.onload = function() {
    let message;
    let title;

    switch(getSessionData().rol) {
        case "administrador":
            title = ADMIN_TITLE;
            message = ADMIN_MESSAGE;
            break;
        case "tutor":
            title = TUTOR_TITLE;
            message = TUTOR_MESSAGE;
            break;
        case "alumno":
            title = STUDENT_TITLE;
            message = STUDENT_MESSAGE;
            break;
        default:
            title = VISITOR_TITLE;
            message = VISITOR_MESSAGE;
    }
    document.getElementById("title").innerHTML = title;
    document.getElementById("message").innerHTML = message;
}
