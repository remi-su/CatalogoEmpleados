
var lstDiccionarioMensaje = ["<Strong>Notificación:</strong>", "Se encuentra vació los registros"];

/// <summary>
/// Método encargado de crear un _lstconjuntoDatos formateado a partir de un objeto JSON
/// </summary>
/// <param name="_lstdatosEmpleados"> Objeto tipo JSON que contiene la información de los empleados.</param>
/// <return>La matriz _lstconjuntoDatos, contiene la información de los empleados.</return>
function CrearConjuntoDatos(_lstdatosEmpleados) {
    var _lstconjuntoDatos = [];

    for (var i = 0; i < _lstdatosEmpleados.length; i++) {
        var _lstfila = [_lstdatosEmpleados[i].idPersona, _lstdatosEmpleados[i].nombrePersona, _lstdatosEmpleados[i].apellidoPersona, _lstdatosEmpleados[i].edad,
                _lstdatosEmpleados[i].email, _lstdatosEmpleados[i].telefono, _lstdatosEmpleados[i].fechaNacimiento.split("T")[0], _lstdatosEmpleados[i].ciudad];
        _lstconjuntoDatos.push(_lstfila);
    }
    return _lstconjuntoDatos;
}


/// <summary>
/// Método encargado de solicitar los registros de los empleados existentes al servidor e imprimirlos en la tabla.
/// </summary>
function SolicitarRegistros() {

    $.ajax({
        type: "GET",
        url: "/Catalogo/Details",
        data: "",
        dataType: "json",
        success: function (_lstdatosEmpleados) {

            if (_lstdatosEmpleados.length == 0) {
                var _lstpaqueteMensaje = ["info", lstDiccionarioMensaje[1]];
                DesplegarNotificacion(_lstpaqueteMensaje);
            }

            var _lstconjuntoDatos = CrearConjuntoDatos(_lstdatosEmpleados);
            var _tbltablaEmpleados = $('#example').DataTable({
                data: _lstconjuntoDatos,
                columns: [
                    { title: "ID" },
                    { title: "Nombre" },
                    { title: "Apellido" },
                    { title: "Edad." },
                    { title: "Email" },
                    { title: "Teléfono" },
                    { title: "Fecha Nacimiento" },
                    { title: "Ciudad" }
                ]
            });

            window["SeleccionarFila"](_tbltablaEmpleados);
        }
    });
}


/// <summary>
/// Método que asigna a la vista un modal y lo despliega en pantalla.
/// </summary>
/// <param name="_curlAccion"> Parámetro que almacena la dirección URL a la que la petición AJAX solicitará.</param>
/// <param name="_cfuncionAEjecutar"> Parámetro de tipo carácter que indica la función a ser ejecutada.</param>
/// <param name="_cparametroFuncion"> Guarda el valor del parámetro de la función que sera ejecutada.</param>
function DesplegarModal(_curlAccion, _cfuncionAEjecutar, _cparametroFuncion) {
    $.ajax({
        type: "POST",
        url: _curlAccion,
        data: "",
        async: false,
        dataType: "HTML",
        success: function (_cmodal) {
            $("#modal").html(_cmodal);
            $("#modal").modal("show");

            if (_cfuncionAEjecutar != null && _cfuncionAEjecutar != "") {
                window[_cfuncionAEjecutar](_cparametroFuncion);
            }
        }
    });
}

/// <summary>
/// Acción de la página principal del Catálogo de Empleados.
/// </summary>
/// <returns>Regresa el documento HTML perteneciente a la página principal del Catálogo de Empleados</returns>
function ObtenerEmpleado(_cinstruccionEjecutada) {
    var _iidPersonaSeleccionada = $("#idPersonaSeleccionada").val();
    if (_iidPersonaSeleccionada != null) {
        $.ajax({
            type: "POST",
            url: "/Catalogo/ObtenerEmpleado",
            data: { _iidentificadorPersona: _iidPersonaSeleccionada },
            dataType: "json",
            success: function (_lstempleadosDatos) {
                InsertarEmpleadoCampos(_lstempleadosDatos);
                if (_cinstruccionEjecutada == "Modificar") {
                    window["ModificarEmpleado"]();
                } else {
                    window["EliminarEmpleado"]();
                }
                
            }
        });


    }
    
}

/// <summary>
/// Método que recolecta el identificador de un registro, para solicitar al servidor su eliminación.
/// </summary>
function EliminarEmpleado() {
    $("#botonConfirmarEliminar").click(function () {
        var _lcamposLlenos = VerificarCampos();
        var _iidPersona = $("#idPersonaSeleccionada").val();
        if (_lcamposLlenos) {
            $.ajax({
                type: "POST",
                url: "/Catalogo/Delete",
                data: { _iidentificador: _iidPersona },
                dataType: "json",
                success: function (_lstpaqueteMensaje) {
                    $("#modal").modal("hide");
                    ResetearDataTable();
                    DesplegarNotificacion(_lstpaqueteMensaje);
                }
            });
        }
        
    });
}


/// <summary>
/// Método que inserta un determinado registro de un empleado en los campos correspondientes del modal.
/// </summary>
/// <param name="_lstdatosEmpleados"> Lista que almacena la información de un determinado empleado.</param>
function InsertarEmpleadoCampos(_lstdatosEmpleados) {
    $("#nombrePersona").val(_lstdatosEmpleados.nombrePersona);
    $("#apellidoPersona").val(_lstdatosEmpleados.apellidoPersona);
    $("#edad").val(_lstdatosEmpleados.edad);
    $("#email").val(_lstdatosEmpleados.email);
    $("#telefono").val(_lstdatosEmpleados.telefono);
    $("#fechaNacimiento").val(_lstdatosEmpleados.fechaNacimiento);
    $("#ciudad").val(_lstdatosEmpleados.ciudad);
    
}

/// <summary>
/// Método que recolecta los datos de los campos de texto del modal, solicita al servidor la creación de un 
/// nuevo registro con la información recolectada.
/// </summary>
/// <param name="_cparametros"> Parámetro de control.</param>
function agregarDatos(_cparametros) {
    $("#botonConfirmarCrear").click(function () {
        var _lcamposLlenos = VerificarCampos();
        if (_lcamposLlenos) {
            var _lstjsonEnviar = ObtenerDatos(null);
            $.ajax({
                type: "POST",
                url: "/Catalogo/Create",
                data: _lstjsonEnviar,
                dataType: "json",
                success: function (_lstpaqueteMensaje) {
                    DesplegarNotificacion(_lstpaqueteMensaje);
                    $("#modal").modal("hide");
                    ResetearDataTable();
                }
            });
        }  
        
    });
}

 /// <summary>
 /// Método que despliega en pantalla un determinado mensaje (Éxito, Error, Información).
 /// </summary>
 ///<param name="paqueteMensaje"> Variable que guarda el mensaje proporcionado por el servidor.</param>
function DesplegarNotificacion(_lstpaqueteMensaje) {
    $("#alertSucess").addClass("alert-" + _lstpaqueteMensaje[0]);
    $("#alertSucess").html(lstDiccionarioMensaje[0] + _lstpaqueteMensaje[1]);
    $("#alertSucess2").slideDown("slow");
    setTimeout('OcultarAlerts()', 4000, _lstpaqueteMensaje[0]);
}

/// <summary>
///  Descripción: Método que oculta la notificación previamente desplegada en pantalla.
/// 
/// <param name="typeAlert"> Variable que indica el tipo de alert que se desplegara en pantalla.</param>

function OcultarAlerts(_ctypeAlert) {
    $("#alertSucess").removeClass("alert-" + _ctypeAlert);
    $("#alertSucess2").slideUp("slow");
}

function ModificarEmpleado() {
    $("#botonConfirmarModificar").click(function () {
        var _lcamposLlenos = VerificarCampos();
        var _iidPersona = $("#idPersonaSeleccionada").val();
        if (_lcamposLlenos) {
            var _lstjsonEnviar = ObtenerDatos(_iidPersona);

            $.ajax({
                type: "POST",
                url: "/Catalogo/Edit",
                data: _lstjsonEnviar,
                dataType: "json",
                success: function (_lstpaqueteMensaje) {
                    $("#modal").modal("hide");
                    ResetearDataTable();
                    DesplegarNotificacion(_lstpaqueteMensaje);
                }
            });
        }
    });
}

function ResetearDataTable() {
    var _tbltablaEmpleados = $('#example').DataTable();
    _tbltablaEmpleados.clear().draw();

    $.ajax({
        type: "POST",
        url: "/Catalogo/Details",
        data: "",
        dataType: "json",
        success: function (_lstdatosEmpleados) {
            var _lstconjuntoDatos = CrearConjuntoDatos(_lstdatosEmpleados);
            _tbltablaEmpleados.rows.add(_lstconjuntoDatos).draw();
            window["SeleccionarFila"](_tbltablaEmpleados);
        }
    });
}

function ObtenerDatos(_iidPersona) {
    

    var _objjsonCrear = new Object();
    if (_iidPersona != null) {
        _objjsonCrear._iidendificadorPersona = _iidPersona; 
    }
    _objjsonCrear.nombrePersona = $("#nombrePersona").val();
    _objjsonCrear.apellidoPersona = $("#apellidoPersona").val();
    _objjsonCrear.edad = $("#edad").val();
    _objjsonCrear.email = $("#email").val();
    _objjsonCrear.telefono = $("#telefono").val();
    _objjsonCrear.fechaNacimiento = $("#fechaNacimiento").val();
    _objjsonCrear.ciudad = $("#ciudad").val();
    
    return _objjsonCrear;
}

function SeleccionarFila(_tbltablaEmpleado) {
    $('#example tbody tr').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#idPersonaSeleccionada').val(null);
        }
        else {
            _tbltablaEmpleado.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var _iidPersona = $(this).children(".sorting_1").text();
            $("#idPersonaSeleccionada").val(_iidPersona);
        }
    });
}

function VerificarCampos() {
    $(".input-entrada").each(function () {
        if (!$(this).val()) {
            $(this).addClass("botonError");
        } else {
            if ($(this).hasClass("botonError")) {
                $(this).removeClass("botonError");
            }
        }
        
    });

    var _lstelementos = document.getElementsByClassName("botonError");

    if (_lstelementos.length == 0) {
        return true;
    } else {
        return false;
    }
}


$(document).ready(function () {
    SolicitarRegistros();
});

$("#botonCrear").click(function () {
    DesplegarModal("/Catalogo/EnviarModalCrear", "agregarDatos", "");
});

$("#botonModificar").click(function () {
    var _iidPersonaSeleccionada = $("#idPersonaSeleccionada").val();
    if (_iidPersonaSeleccionada != null && _iidPersonaSeleccionada != "") {
        DesplegarModal("/Catalogo/EnviarModalModificar", "ObtenerEmpleado", "Modificar");
    }
    
});
 
$("#botonEliminar").click(function () {
    var _iidPersonaSeleccionada = $("#idPersonaSeleccionada").val();
    if (_iidPersonaSeleccionada != null && _iidPersonaSeleccionada != "") {
        DesplegarModal("/Catalogo/EnviarModalEliminar", "ObtenerEmpleado", "Eliminar");
    }

});


