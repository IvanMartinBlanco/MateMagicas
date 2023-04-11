import { getSessionData } from '../js/session.js';

// Llamar a la función de sesión al cargar la página
window.addEventListener('load', getSessionData);
console.log(getSessionData().registeredUser);

//Carga solamente cuando ya se haya creado el DOM.
document.addEventListener("DOMContentLoaded", function (event) {

	const imageUrl = getSessionData().registeredUser ? `../../../front/Resources/Images/${getSessionData().rol}.png` : "../../../front/Resources/Images/avatar.png";
	const myImage = document.getElementById("avatar");
	myImage.src=imageUrl;
	//Función que define el texto que se muestra en el acceso

		  if (getSessionData()?.registeredUser) {
			document.getElementById("login").textContent = getSessionData().name;
		  } else {
			document.getElementById("login").textContent = "Login/Register";
		  }


})
