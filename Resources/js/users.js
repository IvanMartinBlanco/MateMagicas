import { REGISTRO } from './constants.js';

let user = {};
let registeredUser = true;

//Carga solamente cuando ya se haya creado el DOM.
document.addEventListener("DOMContentLoaded", function (event) {

	setUser({ name: "Iván", surname: "Martín", image:"Resources/images/logo.png" });
	function setRegistered(){
		registeredUser=true;
	}
	setRegistered();
	accessText();
	const imageUrl = user.image ? user.image : "./Resources/Images/avatar.png";
	const myImage = document.getElementById("avatar");
	myImage.src=imageUrl;
	//Función que define el texto que se muestra en el acceso
	function accessText() {
		if (registeredUser) {
			document.getElementById("login").textContent = user.name + " " + user.surname;
		} else {
			document.getElementById("login").textContent = REGISTRO;
		}
	}

	function setUser(data){
		user=data;
	}
})
