/**
 * Importa informacion desde el servidor
 * @param {function} callbacks
 * */
var auxClientes;

function importarInfoServer(cb) {

    var oError = {
        "e1": "No fue posible importar los datos.",
        "e2": "No fue posible eliminar los registros"
    };
    var sUrl = sHost + "ajx.bbdd.info.exportar.php";

    $.getJSON(sUrl,function (oJson) {

        //Elimina los clientes
        dbBorrar("assets/sql/delete.droptable.clientes.sql").done(function (jqXHR, textStatus, errorThrown) {

            dbCrearTabla("assets/sql/table.clientes.sql").done(function (jqXHR, textStatus, errorThrown) {

                $.get("assets/sql/insert.clientes.sql", function (sQuery) {

                    $.each(oJson.clientes, function (k, v) {
                        var aux = sQuery;//guardo el string del query
                        db.transaction(function (tx) {
                            tx.executeSql(aux, [v.id, v.nombre, v.id_lugar, v.offline, '']);
                        }, dbError, function(){
                            dbExitoImportacion('Insertando Cliente: ' + v.nombre + ' id: ' + v.id);
                        });
                    });

                });

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(oError.e2);
            });;

        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });

        //Elimina los equinos
        dbBorrar("assets/sql/delete.droptable.equinos.sql").done(function (jqXHR, textStatus, errorThrown) {

            dbCrearTabla("assets/sql/table.equinos.sql").done(function (jqXHR, textStatus, errorThrown) {

                $.get("assets/sql/insert.equinos.sql", function (sQuery) {

                    $.each(oJson.equinos, function (k, v) {
                        var aux = sQuery;//guardo el string del query
                        db.transaction(function (tx) {
                            tx.executeSql(aux, [
                                v.id,
                                v.nombre,
                                v.id_duenio,
                                v.nacimiento,
                                v.obs,
                                v.offline,
                                ''
                            ]);
                        }, dbError, function(){
                            dbExitoImportacion('Insertando Equino: ' + v.nombre + ' id: ' + v.id);
                        });
                    });

                });

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(oError.e2);
            });;

        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });

        //Elimina los problemas
        dbBorrar("assets/sql/delete.droptable.problemas.sql").done(function (jqXHR, textStatus, errorThrown) {
            dbCrearTabla("assets/sql/table.problemas.sql");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });
        //Elimina los evoluciones
        dbBorrar("assets/sql/delete.droptable.evoluciones.sql").done(function (jqXHR, textStatus, errorThrown) {
            dbCrearTabla("assets/sql/table.evoluciones.sql");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });
        //Elimina los estudios
        dbBorrar("assets/sql/delete.droptable.estudios.sql").done(function (jqXHR, textStatus, errorThrown) {
            dbCrearTabla("assets/sql/table.estudios.sql");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });

        //Elimina las medicaciones
        dbBorrar("assets/sql/delete.droptable.medicaciones.sql").done(function (jqXHR, textStatus, errorThrown) {
            dbCrearTabla("assets/sql/table.medicaciones.sql");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });

        //Elimina las practicas
        dbBorrar("assets/sql/delete.droptable.practicas.sql").done(function (jqXHR, textStatus, errorThrown) {
            dbCrearTabla("assets/sql/table.practicas.sql");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(oError.e2);
        });

    }).fail(function () {
        //en caso de error
        alert(oError.e1);
    }).done(function () {
        //en caso de exito

        if(!empty(cb)){
            cb();
        }

    });

}