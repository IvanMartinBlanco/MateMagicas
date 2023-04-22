import { getSessionData } from '../js/session.js';

// Llamar a la función de sesión al cargar la página
window.addEventListener('load', getSessionData);
//Carga solamente cuando ya se haya creado el DOM.
document.addEventListener("DOMContentLoaded", function () {
	const access = document.getElementById("access");
	const imageUrl = getSessionData().registeredUser ? `../../../front/Resources/Images/${getSessionData().rol}.png` : "../../../front/Resources/Images/avatar.png";
	const myImage = document.getElementById("avatar");
	myImage.src = imageUrl;

	if (getSessionData()?.registeredUser) {
		document.getElementById("login").textContent = getSessionData().name;
	} else {
		document.getElementById("login").textContent = "Login/Register";
	}
	access.addEventListener("click", function() {
		const userType = getSessionData().rol; // Reemplaza con la lógica para determinar el tipo de usuario
		console.log(getSessionData().rol)
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
