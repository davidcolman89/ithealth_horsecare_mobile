

function armarOpcionesCombo(json, primeraOpcionVacia) {

    var sOpcion;

    if (primeraOpcionVacia === false) {
        sOpcion = "";
    } else {
        sOpcion = (['<option value="">', '</option>']).join("");
    }

    var aux = $.parseJSON(json);

    $.each(aux, function (fila, oJson) {
        sOpcion += (['<option value="', oJson.v, '">', oJson.t, '</option>']).join("");
    });

    return sOpcion;
}


function armarOpcionesComboClientes(json) {
    var sOpcion;
    sOpcion = (['<option value="">', 'Seleccione Cliente', '</option>']).join("");
    $.each($.parseJSON(json), function (fila, object) {
        sOpcion += (['<option value="', object.v, '">', object.t, '</option>']).join("");
    });
    return sOpcion;
}

function armarOpcionesComboEquinos(json) {
    var sOpcion;
    sOpcion = (['<option value="">', 'Seleccione Equino', '</option>']).join("");
    $.each($.parseJSON(json), function (fila, object) {
        sOpcion += (['<option value="', object.v, '">', object.t, '</option>']).join("");
    });
    return sOpcion;
}

