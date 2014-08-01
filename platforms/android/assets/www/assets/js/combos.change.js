function changeHomeEquinos() {
    var iIE = $(this).val();
    var sData = $.param({
        ie: iIE,
        lp: true
    });

    $.ajax({
        type: "POST",
        url: sHost + "ajx.info.equino.php",
        crossDomain: true,
        data: sData,
        success: function (sRespuesta) {
            var sTr, sTd, iIE;
            var oJson = $.parseJSON(sRespuesta);

            //Tabla Equino Info
            if (oJson.bInfoEq) {
                iIE = oJson.infoEq.equino_id;
            } else {
                iIE = "";
            }

            $('#aInfEqAltaProb,#aInfEqVerProbs').attr("data-ie", iIE);

            //Oculto la celda que contiene el boton para generar problemas
            if (oJson.bEstadoObito) {//esta muerto
                $("#aInfEqAltaProb").hide();
            } else {//esta vivo
                $("#aInfEqAltaProb").show();
            }

            sTr = armarTrEquinoInfo(oJson);
            $("#tableEquinoDataTbody").html(sTr);

            sTr = armarTrEquinoProb(oJson);
            $("#tableEquinoProbTbody").html(sTr);

            //Limpiar lista de evoluciones
            $("#divListEvol").html("");

        }
    });

    $(this).find('option').remove();
    $(this).selectmenu();
    $(this).selectmenu('refresh');

    $("#home_id_cliente").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

    $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino", {
        allowSamePageTransition: true
    });

}

function changeAltaClienteProvincias() {
    var iVal = $(this).val();

    var oJson = {
        ip: iVal
    };
    var sDatos = $.param(oJson);

    $.ajax({
        type: "POST",
        url: sHost + "ajx.cmb.loc.php",
        crossDomain: true,
        data: sDatos,
        success: function (sRespuesta) {
            var sOpcion = armarOpcionesCombo(sRespuesta);
            var sSelector = "#alt_cli_id_localidad";
            $(sSelector).html(sOpcion).selectmenu("refresh");

        }
    });
}

function changeHomeClientes() {
    var iVal = $(this).val();
    var oJson = {
        ic: iVal
    };
    var sDatos = $.param(oJson);

    $.ajax({
        type: "POST",
        url: sHost + "ajx.cmb.equinos.php",
        crossDomain: true,
        data: sDatos,
        success: function (sRespuesta) {
            var sOpcion = armarOpcionesComboEquinos(sRespuesta);
            $("#home_id_equino").html(sOpcion).selectmenu("refresh");
        }
    });
}

function changeModClienteProvincias() {
    var iVal = $(this).val();

    var oJson = {
        ip: iVal
    };
    var sDatos = $.param(oJson);

    $.ajax({
        type: "POST",
        url: sHost + "ajx.cmb.loc.php",
        crossDomain: true,
        data: sDatos,
        success: function (sRespuesta) {
            var sOpcion = armarOpcionesCombo(sRespuesta);
            var sSelector = "#mod_cli_id_localidad";
            $(sSelector).html(sOpcion).selectmenu("refresh");

        }
    });
}
