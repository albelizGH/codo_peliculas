document
	.getElementById("inicioSesionForm")
	.addEventListener("submit", function (event) {
		let correo = document.getElementById("email").value.trim();
		let contrasenia = document.getElementById("password").value;

		// Obtener la contraseña almacenada en localStorage para el correo ingresado
		let contraseniaAlmacenada = localStorage.getItem(correo);

		if (correo === "") {
			alert("Correo electrónico vacío.");
			event.preventDefault();
		} else if (contrasenia === "") { // Verifica si la contraseña está vacía
			alert("Contraseña vacía.");
			event.preventDefault();
		} else if (contraseniaAlmacenada === null) {
			alert("Correo electrónico no registrado.");
			event.preventDefault();
		} else if (contraseniaAlmacenada !== contrasenia) {
			alert("Contraseña incorrecta.");
			event.preventDefault();
		} else {
			alert("Inicio de sesión exitoso.");
		}
	});
