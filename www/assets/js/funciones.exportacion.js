/* funciones exportar info offline */

function dbInsertarExportacion(array,tipo){

    var valores = [
        obtenerFechaHoraActual(),
        JSON.stringify(array),
        tipo
    ];

    dbInsertar("assets/sql/insert.exportaciones.sql",valores);
}


function enviarClientesOffline(json) {
    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }

        dbInsertarExportacion(array,'clientes');

    }

}


function enviarEquinosOffline(json) {
    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'equinos');
    }


}



function enviarProblemasOffline(json) {
    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'problemas');
    }


}



function enviarEvolucionesOffline(json) {
    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'evoluciones');
    }


}



function enviarEstudiosOffline(json) {
    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'estudios');
    }


}

function enviarMedicacionesOffline(json) {

    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'medicaciones');
    }


}

function enviarPracticasOffline(json) {

    var array;
    var results = json.results;
    var iLen = results.rows.length;

    if (iLen > 0) {
        array = [];
        for (var i = 0; i < iLen; i++) {
            array.push(results.rows.item(i));
        }
        dbInsertarExportacion(array,'practicas');
    }


}



function sendExport(){

    dbSeleccionar("assets/sql/select.exportaciones.pendientes.sql",function(json){

        var results = json.results;
        var iLen = results.rows.length;

        if (iLen > 0) {
            var clientes = [];
            var equinos = [];
            var problemas = [];
            var evoluciones = [];
            var estudios = [];
            var medicaciones = [];
            var practicas = [];
            var item,tipo,url,jsonSend;

            //iterar las exportaciones
            for (var i = 0; i < iLen; i++) {

                item = results.rows.item(i);
                tipo = item.tipo;

                switch (tipo){
                    case 'clientes':
                        clientes.push(item.json);
                        break;
                    case 'equinos':
                        equinos.push(item.json);
                        break;
                    case 'problemas':
                        problemas.push(item.json);
                        break;
                    case 'evoluciones':
                        evoluciones.push(item.json);
                        break;
                    case 'estudios':
                        estudios.push(item.json);
                        break;
                    case 'medicaciones':
                        medicaciones.push(item.json);
                        break;
                    case 'practicas':
                        practicas.push(item.json);
                        break;
                }

            }

            url = (sHost + "ajx.export.sqlite.php");
            jsonSend = {
                clientes:JSON.stringify(clientes),
                equinos:JSON.stringify(equinos),
                problemas:JSON.stringify(problemas),
                evoluciones:JSON.stringify(evoluciones),
                estudios:JSON.stringify(estudios),
                medicaciones:JSON.stringify(medicaciones),
                practicas:JSON.stringify(practicas)
            };

            //envia los datos al servidor
            jQuery.post(url,jsonSend).done(doneExportar).fail(failExportar);

        }else{
            $("#div-export-online-msj").text("No hay datos para exportar").css("color", "#cc0000")
                .fadeOut(500)
                .fadeIn(500)
                .fadeOut(500)
                .fadeIn(500)
                .fadeOut(500);
        }

    });

}

function failExportar(jqXHR, textStatus, errorThrown) {

    $("#div-export-online-msj")
        .html("ERROR: Datos no enviados, error al intentar conexion con el servidor.<br>Error de conexión " + errorThrown)
        .css("color", "#cc0000")
        .fadeOut(500)
        .fadeIn(500)
        .fadeOut(500)
        .fadeIn(500)
        .fadeOut(500);

}

//respuesta - valor devuelto desde el servidor
//true -> si se insertaron los datos exportados
//false -> si no se insertaron los datos exportados
function doneExportar(respuesta) {
    var oJson, msj;

    oJson = $.parseJSON(respuesta);

    if (oJson.br) {

        dbEjecutar("assets/sql/update.exportaciones.pendientes.sql",function(json){
            msj = oJson.sr;
            msj+= " <br> Los datos fueron enviados correctamente.";
            $("#div-export-online-msj")
                .html(msj)
                .css("color", "#008CBA")
                .fadeOut(500)
                .fadeIn(500)
                .fadeOut(500)
                .fadeIn(500)
                .fadeOut(500);
            importarInfoServer(cargarCombosByAjax);
        }).done(function(){

        }).fail(function(){
            alert("ERROR: Datos no enviados, error en el proceso del servidor " + oJson.sr);
            $("#div-export-offline-msj").html(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
        });


    } else {
        alert("ERROR: Datos no enviados, error en el proceso del servidor " + oJson.sr);
        $("#div-export-offline-msj").html(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
    }
}