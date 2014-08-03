function armarTrEvolOffline(json) {
    var tr, td, sClassTdEvol;
    //var txtEstudioEstado = '';

    sClassTdEvol = (['id_estado_', json.id_estado]).join("");

    td = (['<td>', json.id_problema, '</td>']).join('');
    td+= (['<td>', json.id_estudio, '</td>']).join('');
    td+= ([
        '<td>',
        json.fecha,
        ' ',
        json.id_lugar,
        ' ',
        json.obs,
        ' ',
        json.id_estado,
        '</td>'
    ]).join('');
    tr = ([
        '<tr',
            ' class="'+sClassTdEvol+'"',
        ' >',
        td,
        '</tr>'
    ]).join('');

    return tr;
}

function armarTrProbOffline(json) {
    var tr, td, aNuevaEvol, aListEvol,sClassTdProb;

    sClassTdProb = (['id_estado_', json.id_estado]).join("");


    if(json.id_estado==1)
    {
        aNuevaEvol = ([
            '<a',
            ' class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all a-nueva-evol aLink"',
                ' data-ip="' + json.id + '">',
            '',
            '</a>'
        ]).join("");
    }else{
        aNuevaEvol = "";
    }

    aListEvol = ([
        '<a',
        ' class="ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all a-list-evol aLink"',
        ' data-ip="' + json.id + '">',
        '',
        '</a>'
    ]).join("");


    td = (['<td>', json.id, '</td>']).join('');
    td+= (['<td>', json.id_estudio, '</td>']).join('');
    td+= ([
        '<td>',
        json.fecha,
        ' ',
        json.id_lugar,
        ' ',
        json.id_dolencia,
        ' ',
        json.obs,
        ' ',
        json.id_estado,
        '</td>'
    ]).join('');
    td+= (['<td>', aNuevaEvol, '</td>']).join('');
    td+= (['<td>', aListEvol, '</td>']).join('');
    tr = ([
        '<tr',
        ' class="'+sClassTdProb+'"',
        ' >',
        td,
        '</tr>'
    ]).join('');

    return tr;
}

function cargarComboClientesBySQLite(sQuery) {

    db.transaction(function (tx) {
        tx.executeSql(sQuery, [], armarOpcionesComboClientesOffline);
    }, dbError, dbExito);

}

function armarOpcionesComboClientesOffline(tx, results) {

    var iLen = results.rows.length;
    var sOpcion, v, t;

    sOpcion = (['<option value="">', 'Seleccione Cliente', '</option>']).join("");

    for (var i = 0; i < iLen; i++) {
        v = results.rows.item(i).value;
        t = results.rows.item(i).text;
        sOpcion += (['<option value="', v, '">', t, '</option>']).join("");
    }

    $("#home_id_cliente,#alt_eq_id_duenio-offline")
        .html(sOpcion)
        .prop('selectedIndex', 0)
        .selectmenu()
        .selectmenu('refresh');

}

function listarProblemasOffline(idEquino, stringSelector) {

    db.transaction(function (tx) {

        var tr;
        var json;
        var sQuery = "SELECT * FROM problemas WHERE id_equino = " + idEquino;

        tx.executeSql(sQuery, [], function (tx, results) {
            var iLen = results.rows.length;

            if(iLen>0){
                for (var i = 0; i < iLen; i++) {
                    json = {
                        id: results.rows.item(i).id,
                        id_equino: results.rows.item(i).id_equino,
                        fecha: results.rows.item(i).fecha,
                        id_lugar: results.rows.item(i).id_lugar,
                        id_dolencia: results.rows.item(i).id_dolencia,
                        id_estado: results.rows.item(i).id_estado,
                        id_estudio: results.rows.item(i).id_estudio,
                        id_medicacion: results.rows.item(i).id_medicacion,
                        id_practica: results.rows.item(i).id_practica,
                        obs: results.rows.item(i).obs
                    };
                    tr += armarTrProbOffline(json);
                }
            }else{
                tr = (['<tr>','<td colspan="5">Sin Datos</td>','</tr>']).join("");
            }

            $(stringSelector).html(tr);

        });

    }, dbError, dbExito);


}

function listarEvolucionesOffline(idProblema, stringSelector) {

    db.transaction(function (tx) {

        var tr;
        var json;
        var sQuery = "SELECT * FROM evoluciones WHERE id_problema = " + idProblema;

        tx.executeSql(sQuery, [], function (tx, results) {
            var iLen = results.rows.length;
            if(iLen>0){
                for (var i = 0; i < iLen; i++) {
                    json = {
                        id: results.rows.item(i).id,
                        id_problema: results.rows.item(i).id_problema,
                        fecha: results.rows.item(i).fecha,
                        id_lugar: results.rows.item(i).id_lugar,
                        id_estado: results.rows.item(i).id_estado,
                        id_estudio: results.rows.item(i).id_estudio,
                        id_medicacion: results.rows.item(i).id_medicacion,
                        id_practica: results.rows.item(i).id_practica,
                        obs: results.rows.item(i).obs
                    };
                    tr += armarTrEvolOffline(json);
                }
            }else{
                tr = (['<tr>','<td colspan="4">Sin Datos</td>','</tr>']).join("");
            }

            $(stringSelector).html(tr);

        });

    }, dbError, dbExito);

}


function doneInsertEstudio() {
}

function failInsertEstudio() {
    alert("No se pudo insertar el estudio.");
}

function insertarEstudio(json) {

    var data = [
        json.id_evolucion,
        json.id_estudio_tipo,
        1,
        obtenerFechaHoraActual()
    ];

    return dbInsertar("assets/sql/insert.estudios.sql", data);

}

function nuevoEstudio(opciones) {

    insertarEstudio(opciones).done(doneInsertEstudio).fail(failInsertEstudio);

}



function insertarMedicacion(json) {

    var data = [
        json.id_evolucion,
        json.id_medicacion_tipo,
        1,
        obtenerFechaHoraActual()
    ];

    return dbInsertar("assets/sql/insert.medicaciones.sql", data);

}

function doneInsertMedicacion() {

}

function failInsertMedicacion() {
    alert("No se pudo insertar la medicacion.");
}

function nuevaMedicacion(opciones) {

    insertarMedicacion(opciones).done(doneInsertMedicacion).fail(failInsertMedicacion);

}

function insertarPractica(json) {

    var data = [
        json.id_evolucion,
        json.id_practica_tipo,
        1,
        obtenerFechaHoraActual()
    ];

    return dbInsertar("assets/sql/insert.practicas.sql", data);

}

function doneInsertPractica() {

}

function failInsertPractica() {
    alert("No se pudo insertar la practica.");
}

function nuevaPractica(opciones) {

    insertarPractica(opciones).done(doneInsertPractica).fail(failInsertPractica);

}

function failInsertEvolucion() {
    alert("No se pudo insertar la evolucion");
}

function doneInsertEvolucion() {

    var sIdFrm = "#frm-evol-alta-offline";
    $(sIdFrm).each(function () {
        this.reset();
    });

    //redirecciona
    $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino_offline", {
        allowSamePageTransition: true
    });

}

function insertarEvolucion(json) {

    var sUrlSql = "assets/sql/insert.evoluciones.sql";

    return $.get(sUrlSql, function (sQuery) {

        var aDatos = [
            json.id_problema,
            json.fecha,
            json.id_lugar,
            json.obs,
            1,
            obtenerFechaHoraActual()
        ];

        var json2 = json;

        db.transaction(function (tx) {

            var idEstudio = json2.id_estudio;
            var idMedicacion = json2.id_medicacion;
            var idPractica = json2.id_practica;

            tx.executeSql(sQuery, aDatos, function(tx,results){
                var idEvolucion = results.insertId;

                if(!empty(idEstudio)){
                    nuevoEstudio({id_evolucion:idEvolucion,id_estudio_tipo:idEstudio});
                    console.log('entre a estudio');
                }

                if(!empty(idMedicacion)){
                    nuevaMedicacion({id_evolucion:idEvolucion,id_medicacion_tipo:idMedicacion});
                }

                if(!empty(idPractica)){
                    nuevaPractica({id_evolucion:idEvolucion,id_practica_tipo:idPractica});
                }

            });

        }, dbError, dbExito);

    });

}

function nuevaEvolucion(opciones) {

    console.log(opciones);

    insertarEvolucion(opciones).done(function(){
        if(!empty(opciones.id_estado)){
            setEstadoProblema(opciones.id_problema,opciones.id_estado);
        }
        doneInsertEvolucion();
    }).fail(failInsertEvolucion);

}

function failInsertProblema() {
    alert("No se pudo insertar el problema");
}

function doneInsertProblema() {

    var sIdFrm = "#frm-alta-prob-offline";
    $(sIdFrm).each(function () {
        this.reset();
    });

    //redirecciona
    $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino_offline", {
        allowSamePageTransition: true
    });

}

function insertarProblema(opciones) {

    var data = [
        opciones.id_equino,
        opciones.id_dolencia,
        opciones.id_estado,
        1,
        obtenerFechaHoraActual()
    ];

    var sUrlSql = "assets/sql/insert.problemas.sql";

    return $.get(sUrlSql, function (sQuery) {

        var aDatos = data;
        var opciones2 = opciones;

        db.transaction(function (tx) {

            tx.executeSql(sQuery, aDatos,function(tx, results){

                var idProblema = results.insertId;

                nuevaEvolucion({
                    id_problema:idProblema,
                    fecha:opciones2.fecha,
                    id_lugar:opciones2.id_lugar,
                    obs:opciones2.obs,
                    id_estudio:opciones2.id_estudio,
                    id_medicacion:opciones2.id_medicacion,
                    id_practica:opciones2.id_practica
                });
            });

        }, dbError, dbExito);

    });

}

function nuevoProblema() {

    insertarProblema({
        id_equino:$('#inpt-hide-ie-offline').val(),
        id_dolencia:$('#prob_id_dolencia-offline').val(),
        id_estado:$('#prob_id_estado-offline').val(),
        fecha:$("#prob_fecha-offline").val(),
        id_lugar:$("#prob_id_lugar-offline").val(),
        obs:$("#prob_obs-offline").val(),
        id_estudio:$("#prob_id_estudio_tipo-offline").val(),
        id_medicacion:$("#prob_id_medicacion-offline").val(),
        id_practica:$("#prob_id_practica-offline").val()
    }).done(doneInsertProblema).fail(failInsertProblema);

}

//function insertarProblema(json) {
//
//    var data = [
//        $("#inpt-hide-ie-offline").val(),
//        $("#prob_fecha-offline").val(),
//        $("#prob_id_dolencia-offline").val(),
//        $("#prob_id_estado-offline").val(),
//        $("#prob_obs-offline").val(),
//        $("#prob_id_lugar-offline").val(),
//        json.idEstudio,
//        $("#prob_id_medicacion-offline").val(),
//        $("#prob_id_practica-offline").val(),
//        1,
//        obtenerFechaHoraActual()
//    ];
//
//    return dbInsertar("assets/sql/insert.problemas.sql", data);
//
//}


//function nuevoEstudio(idEstudioTipo, cb) {
//
//    //guarda primero el estudio
//
//    insertarEstudio({idEstudioTipo: idEstudioTipo}).done(function () {
//        db.transaction(function (tx) {
//            var sQuery = "SELECT MAX(id) AS max_id FROM estudios";//obtiene el ultimo id de id_estudio
//            tx.executeSql(sQuery, [], function (tx, results) {
//                var id = results.rows.item(0).max_id;
//                cb({idEstudio: id});//callback nuevoProblema/nuevaEvolucion
//            });
//        }, dbError, dbExito);
//    }).fail(failInsertEstudio);
//
//}


function insertarEquino(tx, results) {

    var sIdFrm = "#frm-alta-eq-offline";
    var max_id = results.rows.item(0).max_id;
    var id = parseInt(max_id) + parseInt(1);
    var data = [
        id,
        $("#alt_eq_nombre-offline").val(),
        $("#alt_eq_id_duenio-offline").val(),
        $("#alt_eq_nacimiento-offline").val(),
        $("#alt_eq_obs-offline").val(),
        1,
        obtenerFechaHoraActual()
    ];

    dbInsertar("assets/sql/insert.equinos.sql", data);
    $(sIdFrm).each(function () {
        this.reset();
    });
    //redirecciona
    $(":mobile-pagecontainer").pagecontainer("change", "#home", {
        allowSamePageTransition: true
    });

}

function insertarCliente(tx, results) {

    var sIdFrm = "#frm-alta-cli-offline";
    var cliente_max_id = results.rows.item(0).max_id;
    var cliente_id = parseInt(cliente_max_id) + parseInt(1);
    var data = [
        cliente_id,
        $("#alt_cli_nombre-offline").val(),
        $("#alt_cli_id_lugar-offline").val(),
        1,
        obtenerFechaHoraActual()
    ];

    dbInsertar("assets/sql/insert.clientes.sql", data);
    $(sIdFrm).each(function () {
        this.reset();
    });

    //redirecciona
    $(":mobile-pagecontainer").pagecontainer("change", "#home", {
        allowSamePageTransition: true
    });


}



//function insertarEvolucion(json) {
//
//    var data = [
//        $("#inpt-hide-ip-offline").val(),
//        $("#evol_fecha-offline").val(),
//        $("#evol_id_lugar-offline").val(),
//        $("#evol_id_estado-offline").val(),
//        $("#evol_obs-offline").val(),
//        json.idEstudio,
//        $("#evol_id_medicacion-offline").val(),
//        $("#evol_id_practica-offline").val(),
//        1,
//        obtenerFechaHoraActual()
//    ];
//
//    return dbInsertar("assets/sql/insert.evoluciones.sql", data);
//
//}

function obtenerLugarCliente(idEquino,cb){
    var sQuery = "select clientes.id_lugar " +
        "from equinos " +
        "inner join clientes on clientes.id = equinos.id_duenio " +
        "where equinos.id = ? ";
    db.transaction(function (tx) {
        tx.executeSql(sQuery, [idEquino], function(tx,results){

            if(results.rows.item.length>0)
            {
                var obj = results.rows.item(0);
                var idLugar = obj.id_lugar;
                if(!empty(idLugar)){
                    cb(idLugar);
                }
            }

        });
    }, dbError, dbExito);
}


function setIdLugarComboOffline(idLugar,selector)
{
    $(selector).val(idLugar).trigger('change');
}

function setEstadoProblema(idProblema,idEstado)
{
    var sQuery = "UPDATE problemas" +
        " SET id_estado = ? " +
        " WHERE id = ? ";
    db.transaction(function (tx) {
        tx.executeSql(sQuery, [idEstado,idProblema]);
    }, dbError, dbExito);

}