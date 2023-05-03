import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'tutor') {
        // Redirigir a otra página
        window.location.replace("http://localhost/web/front/pages/index.html");
    }
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const name = document.querySelector('#name');
    const serverMessage = document.querySelector('#server-message');
    const tds = document.getElementsByTagName('td');
    fetch(`http://localhost/web/back/public/student?email=${email}`)
        .then(response => {
            if (!response.ok) {
                serverMessage.textContent = "Error en la respuesta del servidor";
            }
            return response.json();
        })
        .then(data => {
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
        .catch(error => {
            console.error(error);
        });
});