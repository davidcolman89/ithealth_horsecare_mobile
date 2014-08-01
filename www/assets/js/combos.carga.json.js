function cargarCombosByJson() {
    var selector;

    //Dolencias
    selector = (['#prob_id_dolencia','#prob_id_dolencia-offline']).join(',');
    armarComboByJson('assets/json/dolencias.json',selector,false);

    //Medicaciones
    selector = ([
        '#prob_id_medicacion',
        '#evol_id_medicacion',
        '#prob_id_medicacion-offline',
        '#evol_id_medicacion-offline'
    ]).join(',');
    armarComboByJson('assets/json/medicaciones.json',selector);

    //Estudios Tipo
    selector = ([
        '#prob_id_estudio_tipo',
        '#evol_id_estudio_tipo',
        '#prob_id_estudio_tipo-offline',
        '#evol_id_estudio_tipo-offline'
    ]).join(',');
    armarComboByJson('assets/json/estudios.json',selector);

    //Practicas
    selector = ([
        '#prob_id_practica',
        '#evol_id_practica',
        '#prob_id_practica-offline',
        '#evol_id_practica-offline'
    ]).join(',');
    armarComboByJson('assets/json/practicas.json',selector);

    //Sexos
    selector = (['#alt_eq_id_sexo','#mod_id_sexo']).join(',');
    armarComboByJson('assets/json/sexos.json',selector);

    //Provincias
    selector = (['#alt_cli_id_provincia','#mod_cli_id_provincia']).join(',');
    armarComboByJson('assets/json/provincias.json',selector);

    //Resultado de dolencias
    selector = (['#prob_id_estado','#evol_id_estado','#prob_id_estado-offline','#evol_id_estado-offline']).join(',');
    armarComboByJson('assets/json/estados_dolencias.json',selector,false);
    
    //Lugares
    selector = ([
        '#prob_id_lugar',
        '#evol_id_lugar',
        '#alt_cli_id_lugar',
        '#mod_cli_id_lugar',
        '#prob_id_lugar-offline',
        '#evol_id_lugar-offline',
        '#alt_cli_id_lugar-offline'
    ]).join(',');
    armarComboByJson('assets/json/lugares.json',selector,false);


}

function armarComboByJson(urlJson,selector,primeraOpcionVacia)
{
    //console.log(urlJson);
    $.getJSON(urlJson).done(function(oJson){

        var opcion;

        if (primeraOpcionVacia === false) {
            opcion = "";
        } else {
            opcion = (['<option value>', '</option>']).join("");
        }

        $.each(oJson, function (k, row) {
            opcion += (['<option value="', row.value, '">', row.text, '</option>']).join("");
        });

        //console.log(opcion);
        $(selector).html(opcion);

    });

}

