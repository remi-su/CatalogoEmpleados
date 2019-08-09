using CatalogoPersonal.Bussiness;
using CatalogoPersonal.Models;
using Newtonsoft.Json;
using System.Web.Mvc;

namespace CatalogoPersonal.Controllers
{
    public class CatalogoController : Controller
    {
        private readonly DAOPersona srvDAOPersona = new DAOPersona();
        private readonly string[] srvDiccionarioDatos = new string[4] { "hubo un problema en el servidor, intente de nuevo", "El empleado se creo correctamente",
                     " El empleado se modificó correctamente", "El empleado se eliminó correctamente" };

        /// <summary>
        /// Acción de la página principal del Catálogo de Empleados.
        /// </summary>
        /// <returns>Regresa el documento HTML perteneciente a la página principal del Catálogo de Empleados</returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Vista Modal para crear un nuevo registro de un empleado
        /// </summary>
        /// <returns>Regresa un documento HTML parcial con el modal estructurado con los campos 
        /// necesarios para la inserción de un nuevo Empleado</returns>
        public ViewResult EnviarModalCrear()
        {
            return View();
        }

        /// <summary>
        /// Vista Modal para modificar un registro existente de un empleado.
        /// </summary>
        /// <returns>Regresa un documento HTML parcial con el modal estructurado con los campos
        /// necesarios para la modificación de un empleado</returns>
        public ViewResult EnviarModalModificar()
        {
            return View();
        }

        /// <summary>
        /// Acción Modal para la eliminación de un registro existente de un empleado.
        /// </summary>
        /// <returns>Regresa un documento HTML parcial con el modal estructurado con los campos
        /// necesarios para la eliminación de un empleado</returns>
        public ViewResult EnviarModalEliminar()
        {
            return View();
        }


        /// <summary>
        ///     Acción que obtiene el listado de los empleados existentes en la base de datos, y los regresa en forma de JSON.
        /// </summary>
        /// <returns>La lista de empleados existentes en forma de JSON</returns>
        public ActionResult Details()
        {
            
            var _vjson = JsonConvert.SerializeObject(srvDAOPersona.ObtenerEmpleados());
            return Content(_vjson, "application/json");
                
        }

        
        /// <summary>
        /// Método para crear un nuevo registro empleado. La acción sea exitosa o no, se le notifica al usuario.
        /// </summary>
        /// <param name="_pernuevaPersona"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Create(Persona _pernuevaPersona)
        {

            bool _lestaPersonaCreada = srvDAOPersona.CrearPersona(_pernuevaPersona);
            var _vjson = "";
            string _cmensaje = "";
            string _ctipoMensaje = "";
            string[] _cpaquete = new string [2];

            if (_lestaPersonaCreada)
            {
                _ctipoMensaje = "success";
                _cmensaje = srvDiccionarioDatos[1];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            } else
            {
                
                _ctipoMensaje = "error";
                _cmensaje = srvDiccionarioDatos[0];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            }

            return Content(_vjson, "application/json");


        }

        /// <summary>
        /// Método para modificar un determinado empleado existente en la base de datos. Sea exitosa o no la acción se le notificara al usuario.
        /// </summary>
        /// <param name="_iidendificadorPersona">Identificador del empleado a modificar.</param>
        /// <param name="_perpersonaModificada">Nueva información del empleado.</param>
        /// <returns>Un paquete con el mensaje y el tipo de mensaje, sea de éxito o fallo.</returns>
        [HttpPost]
        public ActionResult Edit(int _iidendificadorPersona, Persona _perpersonaModificada)
        {

            bool _lestaPersonaModificada = srvDAOPersona.ModificarPersona(_perpersonaModificada, _iidendificadorPersona);

            var _vjson = "";
            string _cmensaje = "";
            string _ctipoMensaje = "";
            string[] _cpaquete = new string[2];

            if (_lestaPersonaModificada)
            {
                _ctipoMensaje = "success";
                _cmensaje = srvDiccionarioDatos[2];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            }
            else
            {

                _ctipoMensaje = "error";
                _cmensaje = srvDiccionarioDatos[0];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            }

            return Content(_vjson, "application/json");

        }


        /// <summary>
        /// Método para eliminar un determinado usuario existente en la base de datos.
        /// </summary>
        /// <param name="_iidentificador">Identificador del empleado a eliminar</param>
        /// <returns>Un paquete con el mensaje y el tipo de mensaje, sea de éxito o fallo.</returns>
        [HttpPost]
        public ActionResult Delete(int _iidentificador)
        {
            bool _lpersonaEliminada = srvDAOPersona.EliminarPersona(_iidentificador);
            var _vjson = "";
            string _cmensaje = "";
            string _ctipoMensaje = "";
            string[] _cpaquete = new string[2];

            if (_lpersonaEliminada)
            {
                _ctipoMensaje = "success";
                _cmensaje = srvDiccionarioDatos[3];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            }
            else
            {

                _ctipoMensaje = "error";
                _cmensaje = srvDiccionarioDatos[0];
                _cpaquete[0] = _ctipoMensaje;
                _cpaquete[1] = _cmensaje;
                _vjson = JsonConvert.SerializeObject(_cpaquete);
            }

            return Content(_vjson, "application/json");

        }

        /// <summary>
        /// Método para obtener la información de un determinado empleado, a través de su identificador.
        /// </summary>
        /// <param name="_iidentificadorPersona">Identificador el empleado existente en la base de datos.</param>
        /// <returns>La información del empleado en forma de JSON</returns>
        [HttpPost]
        public ActionResult ObtenerEmpleado(int _iidentificadorPersona)
        {
            Persona _perempleado = srvDAOPersona.ObtenerPersona(_iidentificadorPersona);
            return Json(_perempleado);
        }
        
    }
}
