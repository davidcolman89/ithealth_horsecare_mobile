
function armarTrEquinoInfo(oJson) {

    var sTd, sTr;

    if (oJson.bInfoEq) {

        sTd = (['<td >', '<b>', oJson.infoEq.equino_nombre, '</b>', '</td>']).join("");
        sTd += (['<td >', '<a href="#" id="aEditarEquino" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all aLink" data-ie="', oJson.infoEq.equino_id, '"></a>', '</td>']).join("");
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

        sTd = (['<td colspan="2">', '<p class="pEquinoObs">', oJson.infoEq.equino_obs, '</p>', '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

    } else {
        sTd = (['<td colspan="9">', "Sin Datos", '</td>']).join("");
        sTr = (['<tr  >', sTd, '</tr>']).join("");
    }

    return sTr;
}

function armarTrEquinoInfoOffline(oJson) {

    var sTd, sTr;

    if (oJson.bInfoEq) {

        sTd = (['<td colspan="2">', oJson.infoEq.equino_nombre, '</td>']).join("");
        sTr = (['<tr  >', sTd, '</tr>']).join("");

        sTd = (['<td>', 'Duenio:', '</td>']).join("");
        sTd += (['<td>', oJson.infoEq.duenio_nombre, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");

    } else {
        sTd = (['<td colspan="9">', "Sin Datos", '</td>']).join("");
        sTr = (['<tr  >', sTd, '</tr>']).join("");
    }

    return sTr;
}

function armarTrEquinoProb(oJson) {
    var sTd, sTr, aListarEvol;

    if (oJson.bInfoEqProb) {

        $.each(oJson.infoEqProb, function (fila, json) {

            var aAgregarEvol = "";
            var sProblemaFecha = json.prob_fecha;
            var iIdProblema = json.prob_id;
            var iIdProbEstado = json.prob_id_estado;
            var iIdEquino = json.equino_id;
            var infoEquino;

            aListarEvol = (['<a href="#" class="ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all aEqProbListEvol aLink" data-ip="', iIdProblema, '" data-ie="', iIdEquino, '"></a>']).join("");

            if (iIdProbEstado == 1 && !oJson.bEstadoObito) {
                aAgregarEvol = (['<a href="#" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqProbAltaEvol aLink" data-ip="', iIdProblema, '" data-ie="', iIdEquino, '"></a>']).join("");
            }

            infoEquino = ([
                sProblemaFecha,
                ' ',
                '#',
                iIdProblema,
                '<br>',
                '<span', ' class="id_estado_' + iIdProbEstado + '"', ' >',
                json.prob_dolencia,
                ', ',
                json.prob_estado,
                '</span>'
            ]).join("");


            //Columnas
            sTd = (['<td>', infoEquino,  '</td>']).join("");

            //Acciones
            sTd += (['<td>', aAgregarEvol, '</td>']).join("");
            sTd += (['<td>', aListarEvol, '</td>']).join("");

            //Fila
            sTr += (['<tr ', ' >', sTd, '</tr>']).join("");

        });

    } else {
        sTd = (['<td colspan="5">', "Sin Datos", '</td>']).join("");
        sTr = (['<tr >', sTd, '</tr>']).join("");
    }

    return sTr;
}

function armarTrEquinoUltimos(oJson) {
    var sTr, sTd, sAEquino;

    $.each(oJson, function (fila, oJsonEq) {
        var sAProblema;
        if (oJsonEq.bEstadoObito) {
            sAProblema = "";
        } else {
            sAProblema = (['<a href="#" id="aUltEqAltaProb_', oJsonEq.equino_id, '" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqAltaProb aAltaProb aLink" data-ie="', oJsonEq.equino_id, '"></a>']).join("");
        }

        sAEquino = (['<a href="#pag_ver_equino" class="aVerEquino aLink" data-ie="', oJsonEq.equino_id, '">', oJsonEq.equino_nombre, '</a>']).join("");

        sTd = (['<td>', sAEquino, '</td>']).join("");
        sTd += (['<td>', oJsonEq.duenio_nombre, '</td>']).join("");
        sTd += (['<td>', oJsonEq.equino_obs, '</td>']).join("");
        sTd += (['<td>', sAProblema, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;

}

function armarTableEvoluciones(oJson) {
    var sTable, sTr, sTrHead;

    sTrHead = armarTrHeadEvoluciones(oJson);
    sTr = '';
    $.each(oJson.infoEvol,function(index,json){
        sTr+= armarTrEvoluciones(json);
    });


    sTable = ([
        '<table data-role="table"  id="tableEquinoEvol" data-mode="" class="ui-body-a ui-shadow table-stripe ui-responsive ui-table">',
        '<thead>',
        sTrHead,
        '</thead>',
        '<tbody>',
        sTr,
        '</tbody>',
        '</table>'
    ]).join("");

    return sTable;
}

function armarTrHeadEvoluciones(json) {
    var sTr, sTh, infoProb ;

    sTh = (['<th colspan="2">', 'Evoluciones del Problema: #', json.id_prob, '</th>']).join("");
    sTr = (['<tr class="ui-bar-a" >', sTh, '</tr>']).join("");

    sTh = (['<th>', 'Info', '</th>']).join("");
    sTr += (['<tr class="ui-bar-a" >', sTh, '</tr>']).join("");

    return sTr;
}


function armarTrEvoluciones(aEvolucion) {
    var sTr = "";
    var sTd;

    $.each(aEvolucion, function (fila, json) {

        var bObs = (!empty(json.evol_obs)) ? true : false;
        var sObs = (bObs) ? ((['<br>', '"', json.evol_obs, '"']).join("")) : '';

        var infoEquino;
        var infoEstudio = '';
        var infoMedicacion = '';
        var infoPractica = '';
        var infoEvolucion;

        var estudios = json.estudios;
        var medicaciones = json.medicaciones;
        var practicas = json.practicas;

        infoEvolucion = ([""]).join("");

        infoEquino = ([
            json.evol_fecha,
            ', ',
            json.evol_lugar,
            ', #' ,
            json.evol_id,
            sObs
        ]).join("");


        if(!empty(estudios)){

            $.each(estudios,function(k,estudio){

                if(!empty(estudio.archivos))
                {

                    var sClassInfoEstudio = (['estudio_activo_', estudio.activo]).join("");
                    var archivos = estudio.archivos;
                    var srcImgEstudio = '';
                    var sClassVerImgEstudio = '';
                    var dataSrc = '';
                    var dataEstudioDoctorNombre = '';
                    var dataEstudioObs = '';
                    var infoArchivo = '';

                    $.each(archivos,function(k,archivo){

                        if(!empty(archivo.nombre))
                        {
                            srcImgEstudio = sPathImage + archivo.nombre;
                            sClassVerImgEstudio = 'btn-ver-img-estudio ';
                            dataSrc = ' data-src="' + srcImgEstudio + '"';
                            dataEstudioDoctorNombre = ' data-doctor-nombre="' + estudio.doctor + '"';
                            dataEstudioObs = ' data-obs="' + estudio.observacion + '"';
                        }

                        infoArchivo+= ([
                            '<a href="#" ' ,
                            dataSrc,
                            dataEstudioDoctorNombre,
                            dataEstudioObs,
                                ' class="' + sClassVerImgEstudio + sClassInfoEstudio + '" ',
                            '> ',
                            estudio.descripcion,
                            '</a>'
                        ]).join("");

                    });


                }

                infoEstudio+= ([
                    '<br>',
                    '<b>Est.</b> ',
                    infoArchivo
                ]).join("");

            });

        }

        if(!empty(medicaciones)){

            $.each(medicaciones,function(k,medicacion){
                infoMedicacion+= ([
                    '<br>','<span>','<b>Med.</b> ',medicacion.descripcion,'</span>'
                ]).join("");
            });

        }

        if(!empty(practicas)){

            $.each(practicas,function(k,practica){
                infoPractica += (['<br>','<span>','<b>Prac.</b> ',practica.descripcion,'</span>']).join("");
            });

        }


        sTd = (['<td>', infoEvolucion,infoEquino, infoEstudio, infoMedicacion, infoPractica,  '</td>']).join("");

        sTr += (['<tr>',  sTd, '</tr>']).join("");

    });

    return sTr;
}



function armarTrClientes(oJson) {
    var sTr, sTd, aEditarCliente;

    $.each(oJson, function (fila, oJsonCli) {

        aEditarCliente = (['<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all aEditarCliente aLink" data-ic="', oJsonCli.id, '">', '</a>']).join("");

        sTd = (['<td>', oJsonCli.nombre, '</td>']).join("");
        sTd += (['<td>', oJsonCli.email, '</td>']).join("");
        sTd += (['<td>', aEditarCliente, '</td>']).join("");

        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;

}

function armarTrEquinos(oJson) {
    var sTr, sTd, sAEquino;

    $.each(oJson, function (fila, oJsonEq) {

        var sAProblema;

        if (oJsonEq.bEstadoObito) {
            sAProblema = "";
        } else {
            sAProblema = (['<a href="#" id="aUltEqAltaProb_', oJsonEq.equino_id, '" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all aEqAltaProb aAltaProb aLink" data-ie="', oJsonEq.equino_id, '"></a>']).join("");
        }

        sAEquino = (['<a href="#pag_ver_equino" class="aVerEquino aLink" data-ie="', oJsonEq.equino_id, '">', oJsonEq.equino_nombre, '</a>']).join("");

        sTd = (['<td>', sAEquino, '</td>']).join("");
        sTd += (['<td>', oJsonEq.duenio_nombre, '</td>']).join("");
        sTd += (['<td>', oJsonEq.equino_obs, '</td>']).join("");
        sTd += (['<td>', sAProblema, '</td>']).join("");
        sTr += (['<tr  >', sTd, '</tr>']).join("");
    });

    return sTr;
}

function armarImgEstudio(idDiv,nombreArchivo){
    var div,img, src;
    src = sPathImage + nombreArchivo;

    img = ([
        '<img',
        ' src="' + src + '"',
        ' alt=""',
        ' >'
    ]).join("");

    div = ([
        '<div data-role="popup" id="' + idDiv + '" style="display:none;">',
        '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
        img,
        '</div>'
    ]).join("");




    return div;
}