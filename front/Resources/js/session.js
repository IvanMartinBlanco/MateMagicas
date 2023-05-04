// Declaramos las variables que se usarán más adelante.
let user = {};
let registeredUser = false;

// Esta función permitirá obtener los datos de la sesión.
function getSessionData() {
  loadSessionDataFromCookie();
  const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  const sessionCookie = cookies.find(cookie => cookie.startsWith("session="));
  if (sessionCookie) {
    const sessionData = JSON.parse(sessionCookie.substring("session=".length));
    return {
      id: sessionData.id,
      name: sessionData.name,
      rol: sessionData.rol,
      registeredUser: registeredUser
    };
  } else {
    return {};
  }
}

// Esta función permitirá modificar los datos de la sesión.
function setSessionData(id, name, rol, registeredUser = true) {
  user.id = id;
  user.name = name;
  user.rol = rol;
  registeredUser = registeredUser;
  document.cookie = `session=${JSON.stringify({ id, name, rol })};max-age=${60 * 60 * 24};path=/`;
}

// Esta función permitirá cargar los datos de la sesión.
function loadSessionDataFromCookie() {
  // Obtener los datos de sesión desde la cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'session') {
      const sessionData = JSON.parse(value);
      user.id = sessionData.id;
      user.name = sessionData.name;
      user.rol = sessionData.rol;
    }
  }
  registeredUser = !!user.id && !!user.name && !!user.rol;
}

// Cargamos los datos de la sesión cuando se carge la página.
window.addEventListener('load', loadSessionDataFromCookie);

// Exportamos las funciones de este módulo.
export { user, registeredUser, getSessionData, setSessionData };