using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Services;
using System.Web.UI;

namespace Proyecto3
{
    public partial class Login : Page
    {
        static string patron = "JulianSYS";

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        [WebMethod(EnableSession = true)]
        public static string GetLogin(string Usuario, string Contrasenia)
        {
            try
            {
                string cs = ConfigurationManager.ConnectionStrings["conexion"].ConnectionString;

                using (var con = new SqlConnection(cs))
                using (var cmd = new SqlCommand("SP_ValidarUsuario", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Usuario", SqlDbType.VarChar, 50).Value = Usuario;
                    cmd.Parameters.Add("@Contrasenia", SqlDbType.VarChar, 50).Value = Contrasenia;
                    cmd.Parameters.Add("@patron", SqlDbType.VarChar, 50).Value = patron;

                    con.Open();
                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            HttpContext.Current.Session["usuariologueado"] = Usuario;

                            return "OK";
                        }
                        else
                        {
                            return "Usuario o contraseña incorrectos.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }
    }
}
