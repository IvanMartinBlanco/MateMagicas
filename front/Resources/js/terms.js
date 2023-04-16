window.onload = function () {
    let message;
    let title;
    fetch(`http://localhost/web/back/public/terms`)
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