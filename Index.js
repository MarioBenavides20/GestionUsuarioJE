// --- Funciones primero ---
function cargarUsuarios() {
    $.ajax({
        type: "POST",
        url: "Index.aspx/ObtenerUsuarios",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d && response.d.success) {
                const lista = response.d.usuarios;
                let html = "";

                lista.forEach(u => {
                    html += `
                        <tr>
                            <td>${u.Usuario}</td>
                            <td>${u.Contrasenia}</td>
                             <td class="text-end">
                                <button type="button" class="btn btn-sm btn-warning me-1 btn-editar" data-id="${u.Id}">
                                  Editar
                                </button>
                                <button type="button" class="btn btn-sm btn-danger btn-eliminar" data-id="${u.Id}">
                                  Eliminar
                                </button>
                            </td>
                        </tr>`;
                });

                $("#tablaUsuarios").html(html);
                $("#totalUsuarios").text(`Total de usuarios: ${lista.length}`);
            } else {
                Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
            }
        }
    });
}

function EliminarUsuario(id) {
    Swal.fire({
        title: '¿Eliminar usuario?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "Index.aspx/EliminarUsuario",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ id: id }),
                success: function (response) {
                    if (response.d && response.d.success) {
                        Swal.fire('Eliminado', 'Usuario eliminado correctamente.', 'success');
                        cargarUsuarios();
                    } else {
                        const mensaje = response.d.message || "No se pudo eliminar.";
                        Swal.fire('Error', mensaje, 'error');
                    }
                },
                error: function () {
                    Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
                }
            });
        }
    });
}

function obtenerUsuarioPorId(id) {
    $.ajax({
        type: "POST",
        url: "Index.aspx/ObtenerUsuarioPorId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ id: id }),
        success: function (response) {
            if (response.d && response.d.success) {
                const usuario = response.d.usuario;
                $("#txtUsuario").val(usuario.Usuario);
                $("#txtContrasenia").val(usuario.Contrasenia);
                $("#btnAgregar").hide();
                if ($("#btnActualizar").length === 0) {
                    $("#btnAgregar").after(`<button id="btnActualizar" class="btn btn-success ms-2">Actualizar</button>`);
                }
                $("#btnActualizar").data("id", usuario.Id);
            } else {
                Swal.fire("Error", response.d.message, "error");
            }
        },
        error: function () {
            Swal.fire("Error", "Error al obtener datos del usuario.", "error");
        }
    });
}

$(document).ready(function () {
    console.log("index.js cargado correctamente");

    // —— Inicio: carga nombre de usuario y enlaces ——
    $.ajax({
        type: "POST",
        url: "Index.aspx/ObtenerUsuarioActual",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            const nombre = res.d && res.d.Usuario ? res.d.Usuario : "Usuario";
            $('#usuarioNav, #usuarioNavHeader').text(nombre);
        },
        error: function () {
            $('#usuarioNav, #usuarioNavHeader').text('Usuario');
        }
    });

    // Click a Perfil
    $('#btnPerfil').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'Perfil.aspx';
    });

    // Click a Home
    $('a.dropdown-item[href="Index.aspx"]').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'Index.aspx';
    });
    // —— Fin: carga nombre de usuario y enlaces ——

    // Cargar listado de usuarios
    cargarUsuarios();

    // Cerrar sesión
    $('#btnCerrarSesion').on('click', function () {
        $.ajax({
            type: "POST",
            url: "Index.aspx/CerrarSesion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d === true) {
                    window.location.href = "Login.aspx";
                } else {
                    Swal.fire("Error", "No se pudo cerrar sesión.");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al cerrar sesión.");
            }
        });
    });

    //eventos para editar y eliminar
    $(document).on("click", ".btn-eliminar", function () {
        const id = $(this).data("id");
        EliminarUsuario(id);
    });

    $(document).on("click", ".btn-editar", function () {
        const id = $(this).data("id");
        obtenerUsuarioPorId(id);
    });

    // Actualizar usuario
    $(document).on("click", "#btnActualizar", function () {
        const id = $(this).data("id");
        const usuario = $('#txtUsuario').val().trim();
        const contrasenia = $('#txtContrasenia').val().trim();

        if (!usuario || !contrasenia) {
            Swal.fire("Advertencia", "Debes completar todos los campos", "warning");
            return;
        }

        const param = { id: id, usuario: usuario, contrasenia: contrasenia };

        $.ajax({
            type: "POST",
            url: "Index.aspx/ActualizarUsuario",
            data: JSON.stringify(param),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d && response.d.success) {
                    Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
                    $('#txtUsuario, #txtContrasenia').val('');
                    $("#btnActualizar").remove();
                    $("#btnAgregar").show();
                    cargarUsuarios();
                } else {
                    Swal.fire("Error", response.d.message || "No se pudo actualizar.", "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error al actualizar usuario", "error");
            }
        });
    });

    // Agregar nuevo usuario
    $('#btnAgregar').click(function (e) {
        e.preventDefault();

        var usuario = $('#txtUsuario').val().trim();
        var contrasenia = $('#txtContrasenia').val().trim();

        if (!usuario || !contrasenia) {
            Swal.fire("Advertencia", "Debes completar todos los campos", "warning");
            return;
        }

        var param = { Usuario: usuario, Contrasenia: contrasenia };

        $.ajax({
            type: "POST",
            url: "Index.aspx/AgregarUsuario",
            data: JSON.stringify(param),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log("Respuesta:", response);
                if (response.d.includes("OK")) {
                    Swal.fire("Éxito", "Usuario agregado correctamente", "success");
                    $('#txtUsuario, #txtContrasenia').val('');
                    cargarUsuarios();
                } else {
                    Swal.fire("Error", response.d, "error");
                }
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", xhr.responseText, "error");
            }
        });
    });
});


