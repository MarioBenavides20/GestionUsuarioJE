<%@ Page Title="" Language="C#" MasterPageFile="~/Masterpage.Master" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="Proyecto3.Index" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
  <asp:ScriptManagerProxy ID="Proxy_IndexJs" runat="server">
    <Scripts>
      <asp:ScriptReference Path="Index.js" />
    </Scripts>
  </asp:ScriptManagerProxy>

  <main class="container mt-4">

    <!-- BOTÓN PARA MOSTRAR FORMULARIO Este es el mas funcional hasta el momento -->
    <div class="mb-3 text-end">
      <button id="btnAgregar" class="btn btn-primary">
        <i class="fas fa-user-plus me-1"></i> Agregar Usuario
      </button>
    </div>

    <!-- FORMULARIO OCULTO (PEQUEÑO Y EXPANDIBLE) -->
    <div id="contenedorFormPequeno" style="display: none; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
      <div class="card p-4">
        <h4 class="card-title mb-4" id="formTitulo">
          <i class="fas fa-user-plus me-2"></i>Agregar Usuario
        </h4>
        <div class="mb-3">
          <label for="txtUsuario" class="form-label">Usuario</label>
          <input type="text" id="txtUsuario" class="form-control" placeholder="Nombre de usuario" />
        </div>
        <div class="mb-3">
          <label for="txtContrasenia" class="form-label">Contraseña</label>
          <input type="password" id="txtContrasenia" class="form-control" placeholder="Contraseña" />
        </div>
        <div class="d-flex justify-content-end">
            <button id="btnCancelar" class="btn btn-secondary me-2">Cancelar</button>
             <button id="btnGuardar" class="btn btn-primary">Guardar</button>
            </div>
      </div>
    </div>

    <!-- TABLA DE USUARIOS -->
    <div id="contenedorTabla">
      <hr class="my-4" />
      <section>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0"><i class="fas fa-users me-2"></i>Lista de Usuarios</h3>
          <span id="totalUsuarios" class="badge bg-primary rounded-pill">Total: 0</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Documento</th>
                <th>Sexo</th>
                <th>Email</th>
                <th>Fecha Nac.</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody id="tablaUsuarios">
              <!-- Se llenará vía JavaScript -->
            </tbody>
          </table>
        </div>
      </section>
    </div>

  </main>
</asp:Content>
