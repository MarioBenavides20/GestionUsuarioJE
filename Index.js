// index.js

$(document).ready(function () {
    console.log("index.js cargado correctamente");

    // Perfil
    $('#btnPerfil').off('click').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'Perfil.aspx';
    });

    // Home (ítem del dropdown que apunta a Index.aspx)
    $('a.dropdown-item[href="Index.aspx"]').off('click').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'Index.aspx';
    });

    // Cerrar sesión
    $('#btnCerrarSesion').off('click').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "Index.aspx/CerrarSesion",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(res => {
            if (res.d === true) window.location.href = "Login.aspx";
            else Swal.fire("Error", "No se pudo cerrar sesión.", "error");
        }).fail(() => {
            Swal.fire("Error", "Error de red al cerrar sesión.", "error");
        });
    });

    // ——— Función para listar usuarios ———
    function cargarUsuarios() {
        $.ajax({
            type: "POST",
            url: "Index.aspx/ObtenerUsuarios",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.d && res.d.success) {
                    const lista = res.d.usuarios;
                    let html = "";
                    lista.forEach(u => {
                        html += `
              <tr>
                <td>${u.Usuario}</td>
                <td>••••••</td>
                <td>${u.Documento || ""}</td>
                <td>${u.Sexo || ""}</td>
                <td>${u.Email || ""}</td>
                <td>${u.FechaNacimiento || ""}</td>
                <td class="text-end">
                  <button type="button" class="btn btn-sm btn-warning me-1 btn-editar" data-id="${u.Id}">Editar</button>
                  <button type="button" class="btn btn-sm btn-danger btn-eliminar" data-id="${u.Id}">Eliminar</button>
                </td>
              </tr>`;
                    });
                    $("#tablaUsuarios").html(html);
                    $("#totalUsuarios").text(`Total: ${lista.length}`);
                } else {
                    Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al cargar usuarios.", "error");
            }
        });
    }

    // ——— Inicial: cargo lista ———
    cargarUsuarios();

    // ——— Mostrar formulario para Agregar ———
    $("#btnAgregar").attr("type", "button").on("click", function () {
        $("#formTitulo").html('<i class="fas fa-user-plus me-2"></i>Agregar Usuario');
        $("#txtUsuario, #txtContrasenia").val("");
        $("#contenedorTabla").hide();
        $("#contenedorFormPequeno").fadeIn();
        // Si existe, quito botón Actualizar
        $("#btnActualizar").remove();
        $("#btnGuardar").show();
    });

    // ——— Cancelar ———
    $("#btnCancelar").attr("type", "button").on("click", function () {
        $("#txtUsuario, #txtContrasenia").val("");
        $("#contenedorFormPequeno").fadeOut();
        $("#contenedorTabla").fadeIn();
        $("#btnActualizar").remove();
    });

    // ——— Guardar nuevo usuario ———
    $("#btnGuardar").attr("type", "button").on("click", function () {
        const usuario = $("#txtUsuario").val().trim();
        const contrasenia = $("#txtContrasenia").val().trim();
        if (!usuario || !contrasenia) {
            Swal.fire("Advertencia", "Usuario y contraseña obligatorios", "warning");
            return;
        }
        $.ajax({
            type: "POST",
            url: "Index.aspx/AgregarUsuario",
            data: JSON.stringify({ Usuario: usuario, Contrasenia: contrasenia }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (typeof res.d === "string" && res.d.includes("OK")) {
                    Swal.fire("Éxito", "Usuario agregado correctamente", "success").then(cargarUsuarios);
                    $("#txtUsuario, #txtContrasenia").val("");
                    $("#contenedorFormPequeno").fadeOut();
                    $("#contenedorTabla").fadeIn();
                } else {
                    Swal.fire("Error", res.d || "No se pudo agregar.", "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al agregar usuario.", "error");
            }
        });
    });

    // ——— Editar: precargar datos ———
    $(document).on("click", ".btn-editar", function () {
        const id = $(this).data("id");
        $.ajax({
            type: "POST",
            url: "Index.aspx/ObtenerUsuarioPorId",
            data: JSON.stringify({ id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.d && res.d.success) {
                    const u = res.d.usuario;
                    $("#txtUsuario").val(u.Usuario);
                    $("#txtContrasenia").val(u.Contrasenia);
                    $("#formTitulo").html('<i class="fas fa-edit me-2"></i>Editar Usuario');
                    $("#contenedorTabla").hide();
                    $("#contenedorFormPequeno").fadeIn();
                    // Pongo botón Actualizar si falta
                    if (!$("#btnActualizar").length) {
                        $("#btnGuardar").after('<button id="btnActualizar" type="button" class="btn btn-success ms-2">Actualizar</button>');
                    }
                    $("#btnGuardar").hide();
                    $("#btnActualizar").data("id", u.Id);
                } else {
                    Swal.fire("Error", res.d.message, "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al obtener usuario.", "error");
            }
        });
    });

    // ——— Actualizar usuario ———
    $(document).on("click", "#btnActualizar", function () {
        const id = $(this).data("id");
        const usuario = $("#txtUsuario").val().trim();
        const contrasenia = $("#txtContrasenia").val().trim();
        if (!usuario || !contrasenia) {
            Swal.fire("Advertencia", "Usuario y contraseña obligatorios", "warning");
            return;
        }
        $.ajax({
            type: "POST",
            url: "Index.aspx/ActualizarUsuario",
            data: JSON.stringify({ id, usuario, contrasenia }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.d && res.d.success) {
                    Swal.fire("Éxito", "Usuario actualizado.", "success").then(() => {
                        $("#txtUsuario, #txtContrasenia").val("");
                        $("#contenedorFormPequeno").fadeOut();
                        $("#contenedorTabla").fadeIn();
                        $("#btnActualizar").remove();
                        $("#btnGuardar").show();
                        cargarUsuarios();
                    });
                } else {
                    Swal.fire("Error", res.d.message || "No se pudo actualizar.", "error");
                }
            },
            error: function () {
                Swal.fire("Error", "Error de red al actualizar usuario.", "error");
            }
        });
    });

    // ——— Eliminar usuario ———
    $(document).on("click", ".btn-eliminar", function () {
        EliminarUsuario($(this).data("id"));
    });

    // ——— Opcional: cargar nombre de usuario en nav ———
    $.ajax({
        type: "POST",
        url: "Index.aspx/ObtenerUsuarioActual",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(res => {
        $('#usuarioNav, #usuarioNavHeader').text((res.d && res.d.Usuario) || 'Usuario');
    }).fail(() => {
        $('#usuarioNav, #usuarioNavHeader').text('Usuario');
    });

});
