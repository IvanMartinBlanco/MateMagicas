let user = {};
let registeredUser = false;

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

function setSessionData(id, name, rol) {
  user.id = id;
  user.name = name;
  user.rol = rol;
  registeredUser = true;
  // Guardar los datos de sesión en una cookie con una duración de 1 día
  document.cookie = `session=${JSON.stringify({ id, name, rol })};max-age=${60*60*24};path=/`;
}

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

// Cargar los datos de sesión desde la cookie al cargar la página
window.addEventListener('load', loadSessionDataFromCookie);

export { user, registeredUser, getSessionData, setSessionData };