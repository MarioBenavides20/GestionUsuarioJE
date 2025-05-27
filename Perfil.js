$(document).ready(function () {
    // Cargar datos de perfil
    $.ajax({
        type: "POST",
        url: "Perfil.aspx/ObtenerPerfil",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.d.success) {
                const d = res.d.data;
                $('#txtUsuario').val(d.Usuario);
                $('#txtDocumento').val(d.Documento);
                $(`input[name="rblSexo"][value="${d.Sexo}"]`).prop('checked', true);
                $('#txtEmail').val(d.Email);
                $('#txtFechaNacimiento').val(d.FechaNacimiento);
            } else {
                Swal.fire('Error', 'No se pudo cargar tu perfil', 'error');
            }
        }
    });

    // Guarda
    $('#btnGuardarPerfil').click(function (e) {
        e.preventDefault();
        const doc = $('#txtDocumento').val().trim();
        const sex = $('input[name="rblSexo"]:checked').val() || "";
        const mail = $('#txtEmail').val().trim();
        const fnac = $('#txtFechaNacimiento').val();

        $.ajax({
            type: "POST",
            url: "Perfil.aspx/ActualizarPerfil",
            data: JSON.stringify({ documento: doc, sexo: sex, email: mail, fechaNacimiento: fnac }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.d.success) {
                    Swal.fire('¡Listo!', 'Perfil actualizado', 'success');
                } else {
                    Swal.fire('Error', 'No se pudo actualizar', 'error');
                }
            }
        });
    });

    // Cambiar contraseña
    $('#btnGuardarPwd').click(function (e) {
        e.preventDefault();

        const actual = $('#txtPwdActual').val().trim();
        const nueva = $('#txtPwdNueva').val().trim();
        const confirm = $('#txtPwdConfirm').val().trim();

        // 1. Validación de campos vacíos
        if (!actual || !nueva || !confirm) {
            Swal.fire('Campos incompletos', 'Por favor completa todos los campos.', 'warning');
            return;
        }

        // 2. Validación de coincidencia de nueva/confirm
        if (nueva !== confirm) {
            Swal.fire('Error', 'La nueva contraseña y la confirmación no coinciden.', 'error');
            return;
        }

        // 3. Llamada AJAX
        $.ajax({
            type: "POST",
            url: "Perfil.aspx/CambiarContrasenia",
            data: JSON.stringify({ actual: actual, nueva: nueva, confirm: confirm }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.d.success) {
                    Swal.fire('¡Éxito!', 'Contraseña cambiada correctamente.', 'success')
                        .then(() => {
                            // Cerrar modal y limpiar campos
                            $('#exampleModal').modal('hide');
                            $('#txtPwdActual, #txtPwdNueva, #txtPwdConfirm').val('');
                        });
                } else {
                    // Mensaje de error
                    Swal.fire('Error', res.d.message || 'Ocurrió un problema.', 'error');
                }
            },
            error: function (xhr, status, error) {
                // Fallo de conexión
                console.error('AJAX error:', status, error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        });
    });

    // Cerrar sesión desde Perfil.aspx
    $('#btnCerrarSesion').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "Index.aspx/CerrarSesion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                // true si la sesión se cerró correctamente
                if (res.d === true) {
                    window.location.href = "Login.aspx";
                } else {
                    Swal.fire("Error", "No se pudo cerrar sesión.", "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al cerrar sesión.", "error");
            }
        });
    });
});