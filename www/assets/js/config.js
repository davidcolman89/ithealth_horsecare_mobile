/*
 * Variables Globlales
 * */
var db;
var sHost;
var sPathImage;
var ithStorage;
var sListaPag;
//TODO agregar las paginas que faltan al listado
sListaPag = ([
    '#pag_altas',
    '#pag_ver_clientes',
    '#pag_ver_ultimos',
    '#pag_ver_equino',
    '#pag_informes',
    '#pag_estudio',
    '#pag_altas_cliente',
    '#pag_altas_equino',
    '#pag_altas_genetica',
    '#pag_altas_problema',
    '#pag_altas_evolucion',
    '#pag_modifi_cliente',
    '#pag_modifi_equino',
    '#pag_altas_estudios_archivos',
    '#pag_estudio'
]).join(",");

//var sHost = "http://localhost/ithealth.b/";
sHost = "http://brasil.ithealth.com.ar/D.Kollman/";
sPathImage = sHost + 'media/';
ithStorage = window.localStorage;
var shostName = 'horsecare';
var version = '1.0';
var displayName = 'Horse Care';
var maxSize = (2 * 1024 * 1024);
var sLeyendaLogin = "Espere unos segundos...comprobando los datos.";
var urlUploadImage = sHost + "ajx.alta.estudio_archivo.php";