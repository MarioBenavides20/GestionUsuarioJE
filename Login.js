/*const { param } = require("jquery");*/

$(document).ready(function () {
    console.log("login.js cargado correctamente");

    $('#btnIngresar').click(function (e) {
        e.preventDefault();
        console.log("Botón Ingresar clickeado");

        var usuario = $('#tbUsuario').val();
        var contrasenia = $('#tbPassword').val();
        console.log("Datos a enviar:", { usuario, contrasenia });

        var param = { Usuario: usuario, Contrasenia: contrasenia}

        $.ajax({
            type: "POST",
            url: "Login.aspx/GetLogin", 
            data: JSON.stringify (param),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log("Respuesta completa del servidor:", response);

                if (response.d.trim() === "OK") {
                    Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success")
                        .then(() => window.location.href = "Index.aspx");
                } else {
                    Swal.fire("Error", `Usuario o contraseña incorrectos.`);
                }
            },
            error: (function (xhr, textStatus, errorthrown) {
                alert(xhr.responseText);
            })
        })
    })

    // Animación de la tarjeta de login
    setTimeout(function () {
        $(".login-card").addClass("show");
    }, 100);
});