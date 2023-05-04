import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
    // Verificamos si el usuario tiene rol de "tutor" al cargar la página.
    if (getSessionData()?.rol !== 'tutor') {
        // Redirigimos a otra página.
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    // Obtenemos elementos del formulario y otras secciones.
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const name = document.querySelector('#name');
    const serverMessage = document.querySelector('#server-message');
    const tds = document.getElementsByTagName('td');

    // Realiza una petición GET para obtener los datos del usuario actual.
    fetch(`http://localhost/web/back/public/student?email=${email}`)
        .then(response => {
            // Si la respuesta no es buena, lanzamos un error.
            if (!response.ok) {
                serverMessage.textContent = "Error en la respuesta del servidor";
            }
            // Convierte los datos recibidos a un objeto JSON.
            return response.json();
        })
        .then(data => {
            // Rellenamos la tabla con los valores obtenidos del servidor.
            name.textContent = data.Nombre + " " + data.Apellidos;
            for (let i = 1; i <= 81; i++) {
                const td = document.getElementById(i);
                const ejercicios = data.Ejercicios.filter(ejercicio => ejercicio.IdEjercicio === i);
                if (ejercicios.length > 0) {
                    ejercicios.forEach(ejercicio => {
                        if (ejercicio.Exito === 1) {
                            const imageUrl = `../Resources/Images/tick.png`;
                            const img = document.createElement('img');
                            img.setAttribute('src', imageUrl);
                            td.appendChild(img);
                        } else if (ejercicio.Exito === 0) {
                            const imageUrl = `../Resources/Images/cross.png`;
                            const img = document.createElement('img');
                            img.setAttribute('src', imageUrl);
                            td.appendChild(img);
                        }
                    });
                }
            }
            for (let i = 0; i < tds.length; i++) {
                if (tds[i].childNodes.length === 0) {
                    tds[i].textContent = '-';
                }
            }
        })
        // Controlamos si ha habido un error en el servidor.
        .catch(error => {
            console.error(error);
        });
});