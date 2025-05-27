<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Proyecto3.Login" EnableEventValidation="false" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login</title>

  <!-- SweetAlert2 -->
  <script src="Plugins/sweetalert2.all.min.js"></script>

  <!-- Bootstrap + jQuery -->
  <link href="Plugins/bootstrap.min.css" rel="stylesheet" />
   <script src="Plugins/jquery/jquery.js"></script>
   <script src="Plugins/jquery/jquery.min.js"></script>
  <script src="Plugins/bootstrap.bundle.min.js"></script>

  <!-- CSS y JS personalizados -->
   <link href="Recursos/Css/Estilos.css" rel="stylesheet" />
    <script src="Login.js"></script>
</head>

<body class="login-page">
  <form id="formulario_Login">
    <div class="container d-flex align-items-center justify-content-center" style="min-height:100vh;">
      <div class="card login-card mx-auto" style="max-width:400px;">
        <h3 class="text-center mb-4">Inicio de Sesión</h3>
        <div class="mb-3">
          <label for="tbUsuario" class="form-label">Usuario</label>   
          <input type="text" id="tbUsuario" class="form-control" placeholder="Nombre de usuario" />
        </div>
        <div class="mb-3">
          <label for="tbPassword" class="form-label">Contraseña</label>
          <input type="password" id="tbPassword" class="form-control" placeholder="Contraseña" />
        </div>
        <div class="d-grid">
          <button type="button" id="btnIngresar" class="btn btn-dark">Ingresar</button>
        </div>
      </div>
    </div>
  </form>
</body>
</html>
