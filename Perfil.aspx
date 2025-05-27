<%@ Page Title="" Language="C#" MasterPageFile="~/Masterpage.Master" AutoEventWireup="true" CodeBehind="Perfil.aspx.cs" Inherits="Proyecto3.Perfil" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
  <!-- <links> o <script> <head> en el head -->
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
  <!-- Carga Perfil.js -->
  <asp:ScriptManagerProxy ID="Proxy_PerfilJs" runat="server">
    <Scripts>
      <asp:ScriptReference Path="Perfil.js" />
    </Scripts>
  </asp:ScriptManagerProxy>

  <!-- Contenedor principal -->
  <div class="container py-4 profile-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Mi Perfil</h2>
    </div>

    <div class="card profile-card p-4 mx-auto" style="max-width:500px">
      <!-- Avatar -->
      <div class="text-center mb-4">
        <img src="Recursos/Imagenes/avatar-placeholder.png"
             alt="Avatar" class="rounded-circle" style="width:100px;height:100px" />
      </div>

      <!-- Usuario (readonly) -->
      <div class="mb-3">
        <label for="txtUsuario" class="form-label">Usuario</label>
        <input type="text" id="txtUsuario" class="form-control" readonly />
      </div>

      <!-- Documento -->
      <div class="mb-3">
        <label for="txtDocumento" class="form-label">Documento</label>
        <input type="number" id="txtDocumento" class="form-control" />
      </div>

      <!-- Sexo -->
      <div class="mb-3">
        <label class="form-label d-block">Sexo</label>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="rblSexo" id="sex
              
              oM" value="M">
          <label class="form-check-label" for="sexoM">M</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="rblSexo" id="sexoF" value="F">
          <label class="form-check-label" for="sexoF">F</label>
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="txtEmail" class="form-label">Email</label>
        <input type="email" id="txtEmail" class="form-control" />
      </div>

      <!-- Fecha de nacimiento -->
      <div class="mb-3">
        <label for="txtFechaNacimiento" class="form-label">Fecha Nac.</label>
        <input type="date" id="txtFechaNacimiento" class="form-control" />
      </div>

      <!-- Botones Guardar y Cambiar Contraseña -->
      <div class="d-flex justify-content-between mt-4">
        <button id="btnGuardarPerfil" class="btn btn-primary">
          Guardar cambios
        </button>
         <!-- Button trigger modal -->
        <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Cambiar contraseña
        </button>
      </div>
    </div>
  </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Cambiar contraseña</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="password" id="txtPwdActual" class="form-control mb-2" placeholder="Contraseña actual" />
          <input type="password" id="txtPwdNueva" class="form-control mb-2" placeholder="Nueva contraseña" />
          <input type="password" id="txtPwdConfirm" class="form-control" placeholder="Confirmar contraseña" />
        </div>
        <div class="modal-footer">
          <button id="btnGuardarPwd" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </div>
  </div>
</div>

</asp:Content>