function armarTrEstudios(json){
    var trEvol, tr;


    trEvol = armarTrEstudiosEvol(json);

    tr = ([trEvol]).join("");
    if(empty(tr)){
        tr = (['<tr>','<td colspan="4">No Hay Pendientes</td>','</tr>']).join("");
    }
    $("#tbody-estudios-tot").html(tr);

}

function armarTrEstudiosEvol(json){
    var tr = '';
    if(!empty(json.estudios_evol)){
        $.each(json.estudios_evol,function(key,obj){
            tr+= armarTrEstudioPendiente(obj);
        });
    }
    return tr;

}


//Captura los archivos
function prepareUpload(event)
{
//    files.push(event.target.files);
    files = event.target.files;
}

function armarTrEstudioPendiente(obj){

    var td,tr,link,idEquino,idEstudio,classEstudio,equinoNombre,estudioTipo;

    equinoNombre = obj.equino_nombre;
    estudioTipo = obj.estudio_tipo;
    idEstudio = obj.id_estudio;
    idEquino = obj.id_equino;
    classEstudio = "estudio_activo" + obj.estudio_activo;


    link = ([
        '<a',
        ' href="#" ',
        ' class="a-alta-est-archivos ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all " ',
        ' data-id="'+ idEstudio +'" ',
        ' data-ie="'+ idEquino +'" ',
        ' data-nom-equino="'+ equinoNombre +'" ',
        ' data-tipo-estudio="'+ estudioTipo +'" ',
        '>',
        '>>',
        '</a>'
    ]).join("");

    td = (['<td>',obj.equino_nombre,'</td>']).join("");
    td+= (['<td>',obj.estudio_tipo,'</td>']).join("");
    td+= (['<td>',obj.fecha_creacion,'</td>']).join("");
    td+= (['<td>',link,'</td>']).join("");
    tr = (['<tr', ' class="' + classEstudio + '"' , ' >',td,'</tr>']).join("");

    return tr;
}

function limpiarInfoEstudio(e) {
    e.preventDefault();
    $("#div-img-estudio").hide();
    $("#img-estudio").attr('src', '');
    $("#img-estudio-popup").attr('src', '');
    $("#div-estudio-doctor-nombre").hide().text('');
    $("#div-estudio-obs").hide().text('');

}

function cargarListadoEstudiosPendientes(cb) {

    $.ajax({
        type: "POST",
        url: sHost + "ajx.list.estudios.php",
        crossDomain: true,
        success: function (sRespuesta) {

            var json = $.parseJSON(sRespuesta);
            armarTrEstudios(json);
            if(!empty(cb)){
                cb();
            }
        }
    });
}

function setOptionSelected(idSelect,value)
{
    var sSelector;
    sSelector = ([idSelect, '>option[value="', value, '"]']).join("");
    $(sSelector).prop('selected', true);
    $(idSelect).selectmenu();
    $(idSelect).selectmenu('refresh');

}

/**
 * MODULO CARGA DE IMAGENES
 */

function uploadPhoto(imageURI,params) {

    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(urlUploadImage), win, fail, options);

}

function win(r) {

    var text;
    var sIdFrm = "#frmAltaEstudioArchivo";

    text = "Archivo Subido";


    $(sIdFrm).each(function () {
        this.reset();
    });

    $("#pEquinoEstudioArchivoAjxResp").text(text).css("color", "#000000").fadeOut(1000).fadeIn(500).fadeOut(5000);

    cargarListadoEstudiosPendientes(function(){
        $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_estudios_pendientes", {allowSamePageTransition: true});
    });


}

function fail(error) {

    var text;

    text = "An error has occurred: Code = " + error.code;

    $("#pEquinoEstudioArchivoAjxResp").text(text).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

}