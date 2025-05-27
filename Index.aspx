<%@ Page Title="" Language="C#" MasterPageFile="~/Masterpage.Master" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="Proyecto3.Index" %>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
  <asp:ScriptManagerProxy ID="Proxy_IndexJs" runat="server">
    <Scripts>
      <asp:ScriptReference Path="Index.js" />
    </Scripts>
  </asp:ScriptManagerProxy>

  <main class="container mt-4">
    <section class="mb-5">
      <h2><i class="fas fa-user-plus me-2"></i>Agregar Nuevo Usuario</h2>
      <div class="row g-3">
        <div class="col-md-6">
          <label for="txtUsuario" class="form-label">Nombre de Usuario</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-user"></i></span>
            <input type="text" id="txtUsuario" class="form-control" placeholder="Ingresa el nombre de usuario">
          </div>
        </div>
        <div class="col-md-6">
          <label for="txtContrasenia" class="form-label">Contraseña</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-lock"></i></span>
            <input type="password" id="txtContrasenia" class="form-control" placeholder="Ingresa la contraseña">
          </div>
        </div>
        <div class="col-12">
          <button id="btnAgregar" class="btn btn-primary">
            <i class="fas fa-save me-1"></i> Agregar Usuario
          </button>
        </div>
      </div>


    </section>

    <hr class="my-4">

    <section>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0"><i class="fas fa-users me-2"></i>Lista de Usuarios</h3>
        <span id="totalUsuarios" class="badge bg-primary rounded-pill">Total: 0</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-dark">
            <tr>
              <th><i class="fas fa-user me-1"></i> Usuario</th>
              <th><i class="fas fa-key me-1"></i> Contraseña</th>
              <th><i class="fas fa-cogs me-1"></i> Acciones</th>
            </tr>
          </thead>
          <tbody id="tablaUsuarios">
            <!-- se llenará vía JS -->
          </tbody>
        </table>
      </div>
    </section>
  </main>
</asp:Content>