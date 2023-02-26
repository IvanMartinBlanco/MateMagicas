//Carga solamente cuando ya se haya creado el DOM.
document.addEventListener("DOMContentLoaded", function(event) {

	//Función que reconoce si se hace scroll de la ventana.
  	window.onscroll = function() {
  		navegadorFijo(), botones()
  	};

  	let nav = document.getElementsByClassName("nav-interno")[0];

	//Función que cambia el tipo de position que usa el navegador interno, para que pueda seguir a la pantalla.
  	function navegadorFijo() {
  		if (window.pageYOffset > nav.offsetTop) {
  			nav.style.position = "fixed";
  			nav.style.marginTop = "0";
  		} else {
  			nav.style.position = "static";
  			nav.style.marginTop = "3em";
  		}
  	}

  	let bus = document.getElementsByClassName("buscador")[0];
  	let hot = document.getElementsByClassName("hoteles")[0];
  	let pre = document.getElementsByClassName("precios")[0];
  	let form = document.getElementsByClassName("formulario")[0];

	//Función que cambia el color a los botones según la altura de la página a la que esté. De esta forma sirven como algo parecido a las migas de pan.
  	function botones() {
		//Condicional que marca si estamos en la parte de arriba del navegador.
  		if (window.pageYOffset < nav.offsetTop) {
  			document.getElementById("boton_bus").classList.remove("miga-pan");
  			document.getElementById("boton_hot").classList.remove("miga-pan");
  			document.getElementById("boton_pre").classList.remove("miga-pan");
  			document.getElementById("boton_for").classList.remove("miga-pan");
  		} else {
			//Condicional que marca si se está a la altura del buscador.
  			if (window.pageYOffset > bus.offsetTop - 40) {
  				document.getElementById("boton_bus").classList.add("miga-pan");
  				document.getElementById("boton_hot").classList.remove("miga-pan");
  				document.getElementById("boton_pre").classList.remove("miga-pan");
  				document.getElementById("boton_for").classList.remove("miga-pan");
  			}
			//Condicional que marca si se está a la altura de los hoteles.
  			if (window.pageYOffset > hot.offsetTop - 40) {
  				document.getElementById("boton_bus").classList.remove("miga-pan");
  				document.getElementById("boton_hot").classList.add("miga-pan");
  				document.getElementById("boton_pre").classList.remove("miga-pan");
  				document.getElementById("boton_for").classList.remove("miga-pan");
  			}
			//Condicional que marca si se está a la altura de los precios.
  			if (window.pageYOffset > pre.offsetTop - 170) {
  				document.getElementById("boton_bus").classList.remove("miga-pan");
  				document.getElementById("boton_hot").classList.remove("miga-pan");
  				document.getElementById("boton_pre").classList.add("miga-pan");
  				document.getElementById("boton_for").classList.remove("miga-pan");
  			}
			//Condicional que marca si se está a la altura del formulario.
  			if (window.pageYOffset > form.offsetTop - 270) {
  				document.getElementById("boton_bus").classList.remove("miga-pan");
  				document.getElementById("boton_hot").classList.remove("miga-pan");
  				document.getElementById("boton_pre").classList.remove("miga-pan");
  				document.getElementById("boton_for").classList.add("miga-pan");
  			}
  		}

  	}

  })
		