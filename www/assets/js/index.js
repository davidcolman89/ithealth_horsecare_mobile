Modernizr.load();
//sacar efectos a jquery mobile
$(document).bind('pageinit', function () {
    $.mobile.defaultPageTransition = 'none';
});

$(function () {

    setearFechaActual();
    ithStorage.setItem("login", 0);
    cargarCombosByJson();
    db = iniciarDBOffline();
    dbCreacionTablas();
    dbCreacionUsuarios();

    $("#divAjxLoading").hide();
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