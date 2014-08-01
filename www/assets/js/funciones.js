function obtenerFechaHoraActual() {
    return date('Y-m-d H:m:s');
}

function obtenerFechaActual() {
    return date('Y-m-d');
}

function setearFechaActual() {
    $(function () {

        var aux = ([
            "#prob_fecha",
            "#evol_fecha",
            "#prob_fecha-offline",
            "#evol_fecha-offline",
        ]).join(",");

        $(aux).attr("value", obtenerFechaActual());
    });
}

function checkSession() {
    var bAux = false;

    if (ithStorage.getItem("login") == 1) {
        bAux = true;
    }

    return bAux;

}

function enviarALogIn() {
    enviarAPresentacion();

    //$(":mobile-pagecontainer").pagecontainer("change", "#login", {
    //    allowSamePageTransition: true
    //});

}

function enviarAPresentacion() {

    $(":mobile-pagecontainer").pagecontainer("change", "#presentacion", {
        allowSamePageTransition: true
    });

}

function onDeviceReady() {


    var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;

    var oTipoConexion = checkConnection();

    if (oTipoConexion.value == Connection.NONE) {
        offline();
    } else {
        online();
    }

}

function checkConnection() {

    var oRespuesta;
    var networkState = navigator.connection.type;
    var states = {};

    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    states[networkState];

    oRespuesta = {
        "value": networkState,
        "text": states[networkState]
    };

    return oRespuesta;

}


function chequearLogInOffline(aData, sIdFrm) {

    $.get("assets/sql/select.usuario.login.sql", function (sQuery) {
        db.transaction(function (tx) {
            var sUsuario = aData[0].value;
            var sPassword = md5(aData[1].value);

            tx.executeSql(sQuery, [sUsuario, sPassword], function (tx, results) {
                var bLogin = false;
                var iLen = results.rows.length;

                if (iLen > 0) {
                    bLogin = true;
                }

                if (bLogin) {

                    ithStorage.setItem("login", 1);

                    $(sIdFrm).each(function () {
                        this.reset();
                    });
                    $("#pLoginAjxResp").text('');
                    $(":mobile-pagecontainer").pagecontainer("change", "#home", {
                        allowSamePageTransition: true
                    });

                } else {
                    var sMsg = "Datos incorrectos."
                    ithStorage.setItem("login", 0);
                    $("#pLoginAjxResp").text(sMsg).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                }

            });
        }, dbError, dbExito);
    });
}