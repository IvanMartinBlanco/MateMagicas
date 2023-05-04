import { getSessionData } from '../js/session.js';

// Cargamos los datos de la sesión cuando se carge la página.
window.addEventListener('load', getSessionData);
// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
	// Obtenemos elementos del elementos de acceso.
	const access = document.getElementById("access");
	const imageUrl = getSessionData().registeredUser ? `../Resources/Images/${getSessionData().rol}.png` : "../Resources/Images/avatar.png";
	const myImage = document.getElementById("avatar");
	myImage.src = imageUrl;
	// Verificamos si el usuario está registrado.
	if (getSessionData()?.registeredUser) {
		document.getElementById("login").textContent = getSessionData().name;
	} else {
		document.getElementById("login").textContent = "Login/Register";
	}
    // Agregamos un evento de escucha a la zona del acceso para redirigir según el tipo de usuario.
	access.addEventListener("click", function () {
		const userType = getSessionData().rol;
		if (userType === "administrador") {
			window.location.href = "./administrator.html";
		} else if (userType === "tutor") {
			window.location.href = "./tutor.html";
		} else if (userType === "alumno") {
			window.location.href = "./student.html";
		} else {
			window.location.href = "./login.html";
		}
	});
})
