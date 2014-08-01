/*
 * Web Sql - Carga Offline
 * */


function iniciarDBOffline() {
    try {
        if (!window.openDatabase) {
            alert('Web SQL Database - Not Supported');
        } else {
            return openDatabase(shostName, version, displayName, maxSize);
        }
    } catch (e) {
        // Error handling
        alert("Error creating the database");
    }
}

/*
 * Creacion de tablas
 * */

function dbCrearTabla(sUrlSql) {
    return $.get(sUrlSql, function (sQuery) {
        db.transaction(function (tx) {
            tx.executeSql(sQuery);
        }, dbError, dbExito);
    });
}

/*
 * Insercion Datos a tabla
 * */

function dbInsertar(sUrlSql, aDatos) {
    return $.get(sUrlSql, function (sQuery) {
        db.transaction(function (tx) {
            tx.executeSql(sQuery, aDatos);
        }, dbError, dbExito);
    });
}

/*
 * Eliminacion Datos en tabla
 * */

function dbBorrar(sUrlSql) {

    return $.get(sUrlSql, function (sQuery) {
        db.transaction(function (tx) {
            tx.executeSql(sQuery);
        }, dbError, dbExito);
    });

}

/*
 * Seleccion Datos en tabla
 * */

function dbSeleccionar(sUrlSql,cb) {

    return $.get(sUrlSql, function (sQuery) {
        db.transaction(function (tx) {

            tx.executeSql(sQuery, [], function (tx, results) {
                cb({results:results});
            });

        }, dbError, dbExito);
    });

}

/*
 * Ejecutar Querys
 * */

function dbEjecutar(sUrlSql,cb) {

    return $.get(sUrlSql, function (sQuery) {
        db.transaction(function (tx) {

            tx.executeSql(sQuery, [], function (tx, results) {
                cb({results:results});
            });

        }, dbError, dbExito);
    });

}

/*
 * Procesos DB
 * */

function dbCreacionTablas() {

    try {
        dbCrearTabla("assets/sql/table.usuarios.sql");
        dbCrearTabla("assets/sql/table.clientes.sql");
        dbCrearTabla("assets/sql/table.equinos.sql");
        dbCrearTabla("assets/sql/table.estudios.sql");
        dbCrearTabla("assets/sql/table.problemas.sql");
        dbCrearTabla("assets/sql/table.evoluciones.sql");
        dbCrearTabla("assets/sql/table.exportaciones.sql");

    } catch (e) {
        alert("ERROR::(fallo en la creacion de tablas)");
    }

}

function dbCreacionUsuarios() {

    $.get("assets/sql/select.usuarios.count.sql", function (sQuery) {
        db.transaction(function (tx) {
            tx.executeSql(sQuery, [], function (tx, results) {
                var iCont;
                iCont = results.rows.item(0).cont;

                if (iCont > 0) {
                    console.log("USUARIOS::(existentes)");
                } else {//Si no existen registros creados

                    $.getJSON("assets/json/usuarios.json",function (oUsuarios) {
                        $.each(oUsuarios, function (k, v) {
                            dbInsertar("assets/sql/insert.usuarios.sql", [v.nombre, v.apellido, v.usuario, v.password]);
                        });
                    }).done(function () {
                        console.log("USUARIOS::(creados)");
                    });

                }

            });
        }, dbError, dbExito);
    });

}

function cargarExportacion(cb){
    dbSeleccionar('assets/sql/export.select.clientes.sql', enviarClientesOffline);
    dbSeleccionar('assets/sql/export.select.equinos.sql', enviarEquinosOffline);
    dbSeleccionar('assets/sql/export.select.problemas.sql', enviarProblemasOffline);
    dbSeleccionar('assets/sql/export.select.evoluciones.sql', enviarEvolucionesOffline);
    dbSeleccionar('assets/sql/export.select.estudios.sql', enviarEstudiosOffline);
    dbSeleccionar('assets/sql/export.select.medicaciones.sql', enviarMedicacionesOffline);
    dbSeleccionar('assets/sql/export.select.practicas.sql', enviarPracticasOffline);

    setTimeout(function(){
        cb();
    }, 4000);

}

/*
 * Callbacks
 * */

function dbError(err) {
    alert("[ERROR]:" + err.message + "; [COD]:" + err.code);
//    console.log();
}

function dbExito() {
    console.log("EXITO!");
}

function dbExitoImportacion(txt) {
    console.log(txt);
    $("#div-export-online-msj")
        .show()
        .text(txt)
        .css("color", "#008CBA")
        .fadeOut(1)
        .fadeIn(1)
        .fadeOut(1)
        .fadeIn(1)
        .fadeOut(1);
}


