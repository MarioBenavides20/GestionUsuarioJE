using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Services;
using System.Web.UI;

namespace Proyecto3
{
    public partial class Index : Page
    {
        static string patron = "JulianSYS";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["usuariologueado"] == null)
                {
                    Response.Redirect("Login.aspx");
                }

                // Desactiva caché para evitar volver atrás
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
                Response.Cache.SetNoStore();
            }
        }

        [WebMethod]
        public static string AgregarUsuario(string Usuario, string Contrasenia)
        {
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["conexion"].ConnectionString;

                using (SqlConnection con = new SqlConnection(cs))
                using (SqlCommand cmd = new SqlCommand("SP_AgregarUsuario", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Usuario", SqlDbType.VarChar, 50).Value = Usuario;
                    cmd.Parameters.Add("@Contrasenia", SqlDbType.VarChar, 50).Value = Contrasenia;
                    cmd.Parameters.Add("@patron", SqlDbType.VarChar, 50).Value = patron;

                    con.Open();
                    int filasAfectadas = cmd.ExecuteNonQuery();

                    if (filasAfectadas > 0)
                        return "OK";
                    else
                        return "No se insertó ningún registro.";
                }
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }

        [WebMethod]
        public static object ObtenerUsuarios()
        {
            var usuarios = new List<object>();
            string cs = ConfigurationManager.ConnectionStrings["conexion"].ConnectionString;

            using (var conn = new SqlConnection(cs))
            using (var cmd = new SqlCommand(@"
        SELECT 
            id, 
            Usuario, 
            CONVERT(varchar, DECRYPTBYPASSPHRASE(@patron, Contrasenia)) AS Contrasenia,
            Documento, 
            Sexo, 
            Email, 
            FechaNacimiento 
        FROM Usuarios", conn))
            {
                cmd.Parameters.AddWithValue("@patron", patron);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        usuarios.Add(new
                        {
                            Id = reader["id"],
                            Usuario = reader["Usuario"].ToString(),
                            Contrasenia = "********",
                            Documento = reader["Documento"]?.ToString() ?? "",
                            Sexo = reader["Sexo"]?.ToString() ?? "",
                            Email = reader["Email"]?.ToString() ?? "",
                            FechaNacimiento = reader["FechaNacimiento"] == DBNull.Value
                                              ? ""
                                              : ((DateTime)reader["FechaNacimiento"]).ToString("yyyy-MM-dd")
                        });
                    }
                }
            }

            return new { success = true, usuarios };
        }

        [WebMethod]
        public static object EliminarUsuario(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conexion"].ConnectionString))
                {
                    string query = "DELETE FROM Usuarios WHERE id = @id";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();
                    int filas = cmd.ExecuteNonQuery();

                    if (filas > 0)
                    {
                        return new { success = true };
                    }
                    else
                    {
                        return new { success = false, message = "Usuario no encontrado." };
                    }
                }
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        [WebMethod]
        public static object ObtenerUsuarioPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conexion"].ConnectionString))
                {
                    conn.Open();
                    string sql = "SELECT Id, Usuario, CONVERT(varchar, DECRYPTBYPASSPHRASE(@pass, Contrasenia)) AS Contrasenia FROM Usuarios WHERE Id = @id";
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@pass", "JulianSYS");

                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        return new
                        {
                            success = true,
                            usuario = new
                            {
                                Id = (int)reader["Id"],
                                Usuario = reader["Usuario"].ToString(),
                                Contrasenia = reader["Contrasenia"].ToString()
                            }
                        };
                    }
                    else
                    {
                        return new { success = false, message = "Usuario no encontrado" };
                    }
                }
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        [WebMethod]
        public static object ActualizarUsuario(int id, string usuario, string contrasenia)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conexion"].ConnectionString))
                {
                    conn.Open();
                    string sql = "UPDATE Usuarios SET Usuario = @usuario, Contrasenia = ENCRYPTBYPASSPHRASE(@pass, @contrasenia) WHERE Id = @id";
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@usuario", usuario);
                    cmd.Parameters.AddWithValue("@contrasenia", contrasenia);
                    cmd.Parameters.AddWithValue("@pass", "JulianSYS");

                    int filas = cmd.ExecuteNonQuery();
                    return new { success = filas > 0 };
                }
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        [WebMethod]

        public static bool CerrarSesion()
        {
            try
            {
                HttpContext.Current.Session.Clear();
                HttpContext.Current.Session.Abandon();

                // Prevención de caché
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                HttpContext.Current.Response.Cache.SetNoStore();
                HttpContext.Current.Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));

                // Elimina cookie de "recordarme"
                if (HttpContext.Current.Request.Cookies["Recordarme"] != null)
                {
                    HttpCookie cookie = new HttpCookie("Recordarme");
                    cookie.Expires = DateTime.Now.AddDays(-1);
                    HttpContext.Current.Response.Cookies.Add(cookie);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }


    }
}
