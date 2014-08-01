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
