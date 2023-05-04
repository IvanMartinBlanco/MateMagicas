// La función window.onload se ejecuta cuando la página ha terminado de cargar.
window.onload = function () {
    // Declaramos las variables que se usarán más adelante.
    let message;
    let title;
    // Realizamos una petición GET al servidor, en la URL especificada.
    fetch(`http://localhost/web/back/public/about`)
        .then(response => {
            // Si la respuesta no es buena, lanzamos un error.
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            // Si la respuesta es satisfactoria, la convertimos a JSON
            return response.json();
        })
        .then(constants => {
            // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente
            title = constants.title;
            message = constants.message;
            // Actualizamos los elementos HTML con los valores obtenidos del servidor
            document.getElementById("title").innerHTML = title;
            document.getElementById("message").innerHTML = message;
        });
};