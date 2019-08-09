using CatalogoPersonal.Models;
using System.Linq;

namespace CatalogoPersonal.Bussiness
{
    public class DAOPersona
    {
        /// <summary>
        /// Método para obtener el listado completo de los registros de empleados existentes en la
        /// base de datos.
        /// </summary>
        /// <returns>Lista de Empleados existentes.</returns>
        public Persona[] ObtenerEmpleados()
        {
            using (Prueba _prubaseDatos = new Prueba())
            {
                _prubaseDatos.Configuration.LazyLoadingEnabled = false;
                return _prubaseDatos.Persona.AsNoTracking().ToArray();
            }
        }

        /// <summary>
        /// Método para obtener un registro especifico de un empleado de la base de datos.
        /// </summary>
        /// <param name="_iidentificadorPersona"> Identificador del empleado a obtener.</param>
        /// <returns>Un objeto tipo Empleado con la información perteneciente al registro encontrado con la ID proporcionada</returns>
        public Persona ObtenerPersona(int _iidentificadorPersona)
        {
            using (Prueba _prubaseDatos = new Prueba())
            {
                Persona _perpersonaEncontrada = _prubaseDatos.Persona.Find(_iidentificadorPersona);
                return _perpersonaEncontrada;
            }
        }

        /// <summary>
        /// Método que crea un nuevo registro en la tabla de Empleado en la base de datos.
        /// </summary>
        /// <param name="_perpersona">Información de un nuevo empleado</param>
        /// <returns>Variable booleana que indica si la acción se realizó con éxito</returns>
        public bool CrearPersona(Persona _perpersona)
        {
            using (Prueba _prubaseDatos = new Prueba())
            {
                try
                {
                    _prubaseDatos.Persona.Add(_perpersona);
                    _prubaseDatos.SaveChanges();
                    return true;
                }catch
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// Método que refleja los cambios realizados a un determinado registro de empleado en la base de datos.
        /// </summary>
        /// <param name="_perpersonaAModificar"> Parámetro que almacena la nueva información del empleado.</param>
        /// <param name="_iidentificadorPersona"> Parámetro que almacena el identificador del empleado a modificar.</param>
        /// <returns>Variable booleana que indica si la acción se realizó con éxito</returns>
        public bool ModificarPersona(Persona _perpersonaAModificar, int _iidentificadorPersona)
        {
            using (Prueba _prubaseDatos = new Prueba())
            {
                try
                {
                    Persona _perpersona = _prubaseDatos.Persona.Find(_iidentificadorPersona);
                    _perpersona.nombrePersona = _perpersonaAModificar.nombrePersona;
                    _perpersona.apellidoPersona = _perpersonaAModificar.apellidoPersona;
                    _perpersona.edad = _perpersonaAModificar.edad;
                    _perpersona.email = _perpersonaAModificar.email;
                    _perpersona.fechaNacimiento = _perpersonaAModificar.fechaNacimiento;
                    _perpersona.ciudad = _perpersonaAModificar.ciudad;
                    _prubaseDatos.Entry(_perpersona).State = System.Data.Entity.EntityState.Modified;
                    _prubaseDatos.SaveChanges();

                    return true;
                } catch
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// Método que refleja la eliminación de un determinado empleado en la base de datos.
        /// </summary>
        /// <param name="_iidentificadorPersona">Parámetro que almacena el identificador del empleado a eliminar.</param>
        /// <returns>Variable booleana que indica si la acción se realizó con éxito</returns>
        public bool EliminarPersona(int _iidentificadorPersona)
        {
            using (Prueba _prubaseDatos = new Prueba())
            {
                try
                {
                    Persona _perpersonaAEliminar = _prubaseDatos.Persona.Find(_iidentificadorPersona);
                    Persona _perpersonaEliminada = _prubaseDatos.Persona.Remove(_perpersonaAEliminar);
                    _prubaseDatos.SaveChanges();
                    return true;
                } catch {
                    return false;
                }
                
            }
        }
        


    }
}