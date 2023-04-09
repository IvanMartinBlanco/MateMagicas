// Llamar a la función de sesión al cargar la página
window.addEventListener('load', getSessionData);

export let user = {};
export let registeredUser = false;

export function getSessionData() {
  // Llamada a la API para obtener los datos de sesión
  fetch('http://localhost/web/back/public/session',{
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    user.name = data.username;
    registeredUser = data.logged_in;
  })
  .catch(error => console.error(error));
}