let contrasenia = document.getElementById("password").value;
let correo = document.getElementById("email").value;

document.getElementById("registroForm").addEventListener("submit", function (event) {
    // Reasignar las variables para obtener los valores actuales en el momento del envío
    contrasenia = document.getElementById("password").value;
    correo = document.getElementById("email").value.trim();

    let correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!correoRegex.test(correo)) {
        alert("Por favor, introduce una dirección de correo electrónico válida.");
        event.preventDefault(); // Previene el envío del formulario
    } else {
        localStorage.setItem(correo, contrasenia);
        alert("Registro completado con éxito, ya puede iniciar sesión.");
    }
});
