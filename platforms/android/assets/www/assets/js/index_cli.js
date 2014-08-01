/**
 * Created by david on 16/05/14.
 */
var sHost = "http://brasil.ithealth.com.ar/D.Kollman/";
var ithStorage = window.localStorage;
//Instanciar LocalStorage
//var sHost = "http://localhost/ithealth.b/";

$(function(){

    ithStorage.setItem("login", 0);

    var sListaPag = "#home,#pag_ver_ultimos,#pag_ver_equino,#pag_modifi_equino";

    $(document).on("pageshow", sListaPag, function(e) {
        e.preventDefault();

        if (!checkLogIn()) {
            enviarALogIn();
        }
    });

    /////////////////////
    //CARGA AJAX COMBOS//
    /////////////////////

    ///////////////////
    //COMBOS //////////
    ///////////////////

    ///////////////////
    //LISTADOS/////////
    ///////////////////

    $("#tableEquinoProbTbody").delegate(".aEqProbListEvol", "click", function(event) {
        event.preventDefault();
        var iIE = $(this).attr("data-ie");
        var iIP = $(this).attr("data-ip");
        var sData = $.param({
            ie : iIE,
            ip : iIP
        });

        $.ajax({
            type : "POST",
            url : sHost + "ajx.info.evoluciones.php",
            crossDomain : true,
            data : sData,
            success : function(sRespuesta) {
                var oJson = $.parseJSON(sRespuesta);
                if (oJson.bInfoEvol) {
                    $("#divListEvol").html(armarTableEvoluciones(oJson));
                } else {
                    $("#divListEvol").html(oJson.sError);
                }

            }
        });
    });

    $("#aInfEqVerProbs").on("click", function(event) {
        event.preventDefault();
        var iIE = $(this).attr("data-ie");
        var sData = $.param({
            ie : iIE,
            lp : false
        });

        $.ajax({
            type : "POST",
            url : sHost + "ajx.info.equino.php",
            crossDomain : true,
            data : sData,
            success : function(sRespuesta) {
                var oJson = $.parseJSON(sRespuesta);
                $("#tableEquinoProbTbody").html(armarTrEquinoProb(oJson));
                //Limpiar lista de evoluciones
                $("#divListEvol").html("");

            }
        });
    });

    $("#tableUltEquinosTbody,#divAltaProbHeader,#divAltaEvolHeader").delegate(".aVerEquino,.btnVerEquino", "click", function() {

        var iIE;

        iIE = $(this).attr("data-ie");

        var sData = $.param({
            ie : iIE,
            lp : true
        });
        $.ajax({
            type : "POST",
            url : sHost + "ajx.info.equino.php",
            crossDomain : true,
            data : sData,
            success : function(sRespuesta) {
                var oJson = $.parseJSON(sRespuesta);
                var iIE = (oJson.bInfoEq) ? oJson.infoEq.equino_id : "";
                $("#aInfEqAltaProb,#aInfEqVerProbs").attr("data-ie", iIE);
                $("#tableEquinoDataTbody").html(armarTrEquinoInfo(oJson));
                $("#tableEquinoProbTbody").html(armarTrEquinoProb(oJson));
                //Oculto la celda que contiene el boton para generar problemas
                if (oJson.bEstadoObito) {//esta muerto
                    $("#aInfEqAltaProb").hide();
                } else {//esta vivo
                    $("#aInfEqAltaProb").show();
                }
                //Limpiar lista de evoluciones
                $("#divListEvol").html("");
            }
        });

    });

    $("#btnVerUltEquinos,.btnVerUltEquinos").on("click", function() {

        $.ajax({
            type : "POST",
            url : sHost + "ajx.list.ult_equinos.php",
            crossDomain : true,
            success : function(sRespuesta) {
                var oJson = $.parseJSON(sRespuesta);
                $("#tableUltEquinosTbody").html(armarTrEquinoUltimos(oJson));
            }
        });
    });

    $("#aVerTodosEquinos").on("click", function() {

        $.ajax({
            type : "POST",
            url : sHost + "ajx.list.equinos.php",
            crossDomain : true,
            success : function(sRespuesta) {
                var oJson = $.parseJSON(sRespuesta);
                $("#tableUltEquinosTbody").html(armarTrEquinos(oJson));
            }
        });
    });

    ///////////////////
    //BOTONES GUARDAR//
    ///////////////////

    ///////////////////
    //BOTONES ALTAS////
    ///////////////////

    ///////////////////
    //BOTONES EDITAR///
    ///////////////////

    ///////////////////
    //BOTON LOGIN//////
    ///////////////////

    $(".btnLogout").on("click", function() {

        ithStorage.setItem("login", 0);
        enviarALogIn();

    });

    $("#btnLogin").on("click", function() {
        var sIdFrm = "#frmLogIn";
        var sDatosFrm = $(sIdFrm).serialize();

        $.ajax({
            type : "POST",
            url : sHost + "ajx.login.php",
            crossDomain : true,
            data : sDatosFrm,
            success : function(sJson) {
                var oJson = $.parseJSON(sJson);

                if (oJson.br) {

                    ithStorage.setItem("login", 1);

                    $(sIdFrm).each(function() {
                        this.reset();
                    });
                    $(":mobile-pagecontainer").pagecontainer("change", "#home", {
                        allowSamePageTransition : true
                    });

                } else {

                    ithStorage.setItem("login", 0);
                    $("#pLoginAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                }

            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                $("#pLoginAjxResp").text("Error de conexión").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
            }
        });
    });

});

function armarTrEquinoInfo(oJson) {

    var sTd, sTr;

    if (oJson.bInfoEq) {

        //var aEditarEquino = (['<a href="#" id="aEditarEquino" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all aLink" data-ie="', oJson.infoEq.equino_id, '"></a>']).join("");
        var aEditarEquino = "";
        sTd = (['<td >', oJson.infoEq.equino_nombre, '</td>']).join("");
        sTd += (['<td >', aEditarEquino, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Duenio:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.duenio_nombre, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Sexo:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.equino_sexo, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Nacimiento:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.equino_nac, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Padrillo:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.equino_padrillo, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Madre:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.equino_madre, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Abuelo:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.equino_abuelo, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td colspan="2">', '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td colspan="2">','<p class="pEquinoObs">', oJson.infoEq.equino_obs, '</p>','</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

    } else {
        sTd = (['<td colspan="9">', "Sin Datos", '</td>']).join("");
        sTr = (['<tr  >', sTd, '</tr>']).join("");
    }

    return sTr;
}

function armarTrEquinoProb(oJson) {
    var sTd, sTr, aAgregarEvol, aListarEvol;

    if (oJson.bInfoEqProb) {

        $.each(oJson.infoEqProb, function(k, v) {
            var aAgregarEvol = "";
            /*
             if (v.prob_id_estado == 2 && !oJson.bEstadoObito) {
             aAgregarEvol = (['<a href="#" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqProbAltaEvol aLink" data-ip="', v.prob_id, '" data-ie="', v.equino_id, '"></a>']).join("");
             }
             */
            aListarEvol = (['<a href="#" class="ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all aEqProbListEvol aLink" data-ip="', v.prob_id, '" data-ie="', v.equino_id, '"></a>']).join("");

            sTd = (['<td>', v.prob_id, '</td>']).join("");
            sTd += (['<td>', v.prob_fec, ', ', v.prob_lugar, ', ', v.prob_dolencia, ', ', v.prob_estado, '</td>']).join("");
            sTd += (['<td>', aAgregarEvol, '</td>']).join("");
            sTd += (['<td>', aListarEvol, '</td>']).join("");

            sTr += (['<tr ', 'class="id_estado_', v.prob_id_estado, '" >', sTd, '</tr>']).join("");
        });

    } else {
        sTd = (['<td colspan="5">', "Sin Datos", '</td>']).join("");
        sTr = (['<tr >', sTd, '</tr>']).join("");
    }

    return sTr;
}

function armarTrEquinoUltimos(oJson) {
    var sTr, sTd, sAProblema, sAEquino;

    $.each(oJson, function(fila, oJsonEq) {
        //var sAProblema = (['<a href="#" id="aUltEqAltaProb_', oJsonEq.equino_id, '" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqAltaProb aAltaProb aLink" data-ie="', oJsonEq.equino_id, '"></a>']).join("");
        var sAProblema = "";
        sAEquino = (['<a href="#pag_ver_equino" class="aVerEquino aLink" data-ie="', oJsonEq.equino_id, '">', oJsonEq.equino_nombre, '</a>']).join("");

        sTd = (['<td>', sAEquino, '</td>']).join("");
        sTd += (['<td>', oJsonEq.duenio_nombre, '</td>']).join("");
        sTd += (['<td>', oJsonEq.equino_obs, '</td>']).join("");
        //sTd += (['<td>', sAProblema, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;

}

function armarTableEvoluciones(oJson) {
    var sTable, sTr, sTrHead;

    sTrHead = armarTrHeadEvoluciones();
    sTr = armarTrEvoluciones(oJson);

    sTable = (['<table data-role="table"  id="tableEquinoEvol" data-mode="" class="ui-body-a ui-shadow table-stripe ui-responsive ui-table">', '<thead>', sTrHead, '</thead>', '<tbody>', sTr, '</tbody>', '</table>']).join("");

    return sTable;
}

function armarTrHeadEvoluciones() {
    var sTr, sTh;

    sTh = (['<th colspan="2">', 'Evoluciones', '</th>']).join("");
    sTr = (['<tr class="ui-bar-a" >', sTh, '</tr>']).join("");

    sTh = (['<th>', '#Prob', '</th>']).join("");
    sTh += (['<th>', 'Info', '</th>']).join("");
    sTr += (['<tr class="ui-bar-a" >', sTh, '</tr>']).join("");

    return sTr;
}

function armarTrEvoluciones(oJson) {
    var sTr = "";
    var sTd;

    $.each(oJson.infoEvol, function(fila, oJsonEvol) {

        var bObs = (oJsonEvol.evol_obs != "") ? true : false;
        var sObs = (bObs) ? ((['<br>', '"', oJsonEvol.evol_obs, '"']).join("")) : '';

        sTd = (['<td>', oJsonEvol.evol_prob_id, '</td>']).join("");

        sTd += (['<td>', oJsonEvol.evol_fecha, ', ', oJsonEvol.evol_lugar, ', ', oJsonEvol.evol_resultado, sObs, '</td>']).join("");

        sTr += (['<tr', ' class="id_estado_', oJsonEvol.evol_id_estado, '" ', '>', sTd, '</tr>']).join("");
    });

    return sTr;
}

function armarTrClientes(oJson) {
    var sTr, sTd, aEditarCliente;

    $.each(oJson, function(fila, oJsonCli) {

        aEditarCliente = (['<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all aEditarCliente aLink" data-ic="', oJsonCli.id, '">', '</a>']).join("");

        sTd = (['<td>', oJsonCli.nombre, '</td>']).join("");
        sTd += (['<td>', oJsonCli.email, '</td>']).join("");
        sTd += (['<td>', aEditarCliente, '</td>']).join("");

        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;

}

function armarTrEquinos(oJson) {
    var sTr, sTd, sAProblema, sAEquino;

    $.each(oJson, function(fila, oJsonEq) {
        //var sAProblema = (['<a href="#" id="aUltEqAltaProb_', oJsonEq.equino_id, '" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqAltaProb aAltaProb aLink" data-ie="', oJsonEq.equino_id, '"></a>']).join("");
        var sAProblema = "";
        var sAEquino = (['<a href="#pag_ver_equino" class="aVerEquino aLink" data-ie="', oJsonEq.equino_id, '">', oJsonEq.equino_nombre, '</a>']).join("");

        sTd = (['<td>', sAEquino, '</td>']).join("");
        sTd += (['<td>', oJsonEq.duenio_nombre, '</td>']).join("");
        sTd += (['<td>', oJsonEq.equino_obs, '</td>']).join("");
        //sTd += (['<td>', sAProblema, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;
}

function checkLogIn() {

    var bAux = false;

    if (ithStorage.getItem("login") == 1) {
        bAux = true;
    }

    return bAux;

}

function enviarALogIn() {
    $(":mobile-pagecontainer").pagecontainer("change", "#login", {
        allowSamePageTransition : true
    });

}