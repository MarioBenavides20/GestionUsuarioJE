using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Services;
using System.Web.UI;

namespace Proyecto3
{
    public partial class Perfil : Page
    {
        const string patron = "JulianSYS";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["usuariologueado"] == null)
                    Response.Redirect("Login.aspx");
            }
        }

        [WebMethod(EnableSession = true)]
        public static object ObtenerPerfil()
        {
            var usr = HttpContext.Current.Session["usuariologueado"]?.ToString();
            if (usr == null) return new { success = false };

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["conexion"].ConnectionString))
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = @"
                  SELECT Usuario,
                         Documento, Sexo, Email, FechaNacimiento
                  FROM Usuarios
                  WHERE Usuario = @usr";
                cmd.Parameters.AddWithValue("@usr", usr);
                con.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    if (!rdr.Read()) return new { success = false };
                    return new
                    {
                        success = true,
                        data = new
                        {
                            Usuario = rdr["Usuario"].ToString(),
                            Documento = rdr["Documento"]?.ToString() ?? "",
                            Sexo = rdr["Sexo"]?.ToString() ?? "",
                            Email = rdr["Email"]?.ToString() ?? "",
                            FechaNacimiento = rdr["FechaNacimiento"] == DBNull.Value
                                              ? ""
                                              : Convert.ToDateTime(rdr["FechaNacimiento"])
                                                        .ToString("yyyy-MM-dd")
                        }
                    };
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public static object ActualizarPerfil(string documento, string sexo, string email, string fechaNacimiento)
        {
            var usr = HttpContext.Current.Session["usuariologueado"]?.ToString();
            if (usr == null) return new { success = false };

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["conexion"].ConnectionString))
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = @"
                  UPDATE Usuarios
                  SET Documento = @doc,
                      Sexo = @sex,
                      Email = @mail,
                      FechaNacimiento = @fnac
                  WHERE Usuario = @usr";
                cmd.Parameters.AddWithValue("@doc", string.IsNullOrWhiteSpace(documento) ? (object)DBNull.Value : documento);
                cmd.Parameters.AddWithValue("@sex", string.IsNullOrWhiteSpace(sexo) ? (object)DBNull.Value : sexo);
                cmd.Parameters.AddWithValue("@mail", string.IsNullOrWhiteSpace(email) ? (object)DBNull.Value : email);
                cmd.Parameters.AddWithValue("@fnac", string.IsNullOrWhiteSpace(fechaNacimiento) ? (object)DBNull.Value : fechaNacimiento);
                cmd.Parameters.AddWithValue("@usr", usr);
                con.Open();
                int filas = cmd.ExecuteNonQuery();
                return new { success = filas > 0 };
            }
        }

        [WebMethod(EnableSession = true)]
        public static object CambiarContrasenia(string actual, string nueva, string confirm)
        {
            var usr = HttpContext.Current.Session["usuariologueado"]?.ToString();
            if (usr == null) return new { success = false, message = "Sesión expirada." };

            // Validaciones
            if (string.IsNullOrEmpty(nueva))
                return new { success = false, message = "La nueva contraseña no puede estar vacía." };
            if (nueva != confirm)
                return new { success = false, message = "Las contraseñas no coinciden." };

            string cs = ConfigurationManager.ConnectionStrings["conexion"].ConnectionString;
            // Verificar actual
            bool ok;
            using (var con = new SqlConnection(cs))
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = @"
                  SELECT CASE WHEN CONVERT(varchar, DECRYPTBYPASSPHRASE(@patron, Contrasenia)) = @actual THEN 1 ELSE 0 END
                  FROM Usuarios WHERE Usuario = @usr";
                cmd.Parameters.AddWithValue("@patron", patron);
                cmd.Parameters.AddWithValue("@actual", actual);
                cmd.Parameters.AddWithValue("@usr", usr);
                con.Open();
                ok = (int)cmd.ExecuteScalar() == 1;
            }
            if (!ok) return new { success = false, message = "Contraseña actual incorrecta." };

            // Actualizar
            using (var con = new SqlConnection(cs))
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = @"
                  UPDATE Usuarios
                  SET Contrasenia = ENCRYPTBYPASSPHRASE(@patron, @nueva)
                  WHERE Usuario = @usr";
                cmd.Parameters.AddWithValue("@patron", patron);
                cmd.Parameters.AddWithValue("@nueva", nueva);
                cmd.Parameters.AddWithValue("@usr", usr);
                con.Open();
                cmd.ExecuteNonQuery();
            }

            return new { success = true };
        }
    }
}