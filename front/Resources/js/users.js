import { user, registeredUser, getSessionData } from '../js/session.js';

// Llamar a la función de sesión al cargar la página
window.addEventListener('load', getSessionData);


//Carga solamente cuando ya se haya creado el DOM.
document.addEventListener("DOMContentLoaded", function (event) {


	const imageUrl = user.image && registeredUser ? user.image : "../../../front/Resources/Images/avatar.png";
	const myImage = document.getElementById("avatar");
	myImage.src=imageUrl;
	//Función que define el texto que se muestra en el acceso

		  if (registeredUser) {
			document.getElementById("login").textContent = user.name;
		  } else {
			document.getElementById("login").textContent = "Login/Register";
		  }


})
