Modernizr.load();
//sacar efectos a jquery mobile
$(document).bind('pageinit', function () {
    $.mobile.defaultPageTransition = 'none';
});

$(function () {

    ithStorage.setItem("login", 0);
    cargarCombosByJson();
    db = iniciarDBOffline();
    dbCreacionTablas();
    dbCreacionUsuarios();

    $(".div-ajax-loading").hide();
    $("#div-export-offline-msj").hide().html("");

    $(".btnLogout").on("click", function () {
        ithStorage.setItem("login", 0);
        enviarALogIn();
    });

    $(document).on("pageshow", "#presentacion", function (e) {
        e.preventDefault();
        setTimeout(function(){
            $("#presentacion").show().delay( 1600 ).fadeOut(1600,function(){
                $(":mobile-pagecontainer").pagecontainer("change", "#login", {allowSamePageTransition: true});
            });
        },1);
    });

    var paginasDatePicker = ([
        '#pag_altas_equino',
        '#pag_altas_problema',
        '#pag_altas_evolucion',
        '#pag_altas_equino_offline',
        '#pag_altas_problema_offline',
        '#pag_altas_evolucion_offline',
        '#pag_modifi_equino',
    ]).join(",");

    $( document ).on( "pagecreate", paginasDatePicker, function() {

        var picker = $( ".dc-datepicker", this );

        picker.mobipick({
            date: obtenerFechaActual(),
            locale:'es'
        });

        picker.on( "change", function() {
            var date = $( this ).val();

            // formatted date
            var dateObject = $( this ).mobipick( "option", "date" );
        });


    });

    if (!checkSession()) {
        enviarALogIn();
    }

    $(document).on("pageshow", sListaPag, function (e) {
        e.preventDefault();

        if (!checkSession()) {
            enviarALogIn();
        }
    });

    document.addEventListener("deviceready", onDeviceReady, false);

});