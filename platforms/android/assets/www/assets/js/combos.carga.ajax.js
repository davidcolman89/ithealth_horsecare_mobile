function cargarCombosByAjax() {

    cargarComboClienteAjx();
    cargarComboGeneticaAjx();

}

function cargarComboClienteAjx(cb)
{

    return $.ajax({
        type: "POST",
        url: sHost + "ajx.cmb.cli.php",
        crossDomain: true
    }).done(function (sRespuesta) {

        var sOpcion;
        sOpcion = armarOpcionesCombo(sRespuesta);

        $("#mod_id_duenio,#alt_eq_id_duenio").html(sOpcion);

        sOpcion = armarOpcionesComboClientes(sRespuesta);
        $("#home_id_cliente,#mod_id_duenio").html(sOpcion);

        if(!empty(cb)){ cb(); }

    }).fail(function(){
        alert('Error al cargar los Duenios');
    });

}

function cargarComboGeneticaAjx(cb)
{

    return $.ajax({
        type: "POST",
        url: sHost + "ajx.cmb.equinos_gen.php",
        crossDomain: true
    }).done(function (sRespuesta) {
        var sOpcion;
        sOpcion = armarOpcionesCombo(sRespuesta);
        $("#mod_id_padrillo,#alt_eq_id_padrillo").html(sOpcion);
        $("#mod_id_madre,#alt_eq_id_madre").html(sOpcion);
        $("#mod_id_abuelo,#alt_eq_id_abuelo").html(sOpcion);

        if(!empty(cb)){ cb(); }

    }).fail(function(){
        alert('Error al cargar los parientes');
    });

}