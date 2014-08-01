var files;

function online() {
    $(function () {

        $("#span-estado-app").addClass("dc-estado-online").text("ONLINE");
        $(".div-offline").hide();
        cargarCombosByAjax();

        $( document ).on( "pagecreate", function() {
            $( ".photopopup" ).on({
                popupbeforeposition: function() {
                    var maxHeight = $( window ).height() - 60 + "px";
                    $( ".photopopup img" ).css( "max-height", maxHeight );
                }
            });
        });

        $(document).on("pageshow", "#home", function (e) {
            e.preventDefault();
            if (!checkSession()) {
                enviarALogIn();
            }else{
                $("#home_id_cliente").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');
            }
        });

        $(document).on("pageshow", "#pag_ver_equino", function(e){
            limpiarInfoEstudio(e);
        });
        $("#btn-close-info-estudio").on('click',limpiarInfoEstudio);


        ///////////////////
        //SELECT.CHANGE////
        ///////////////////

        $("#home_id_cliente").on("change", changeHomeClientes);
        $("#home_id_equino").on("change", changeHomeEquinos);
        $("#alt_cli_id_provincia").on("change", changeAltaClienteProvincias);
        $("#mod_cli_id_provincia").on("change", changeModClienteProvincias);

        ///////////////////
        //LISTADOS/////////
        ///////////////////

        $("#tableEquinoProbTbody").delegate(".aEqProbListEvol", "click", function (event) {
            event.preventDefault();
            var idEquino = $(this).attr("data-ie");
            var iIP = $(this).attr("data-ip");
            var sData = $.param({
                ie: idEquino,
                ip: iIP
            });

            $("#div-problema-ajax-loading").show();
            $("#div-img-estudio").hide();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.info.evoluciones.php",
                crossDomain: true,
                data: sData,
                success: function (sRespuesta) {
                    var oJson = $.parseJSON(sRespuesta);
                    if (oJson.bInfoEvol) {
                        $("#divListEvol").html(armarTableEvoluciones(oJson));
                    } else {
                        $("#divListEvol").html(oJson.sError);
                    }

                    $("#div-problema-ajax-loading").hide();

                }
            });
        });

        $("#aInfEqVerProbs").on("click", function (event) {
            event.preventDefault();
            var idEquino = $(this).attr("data-ie");
            var sData = $.param({
                ie: idEquino,
                lp: false
            });

            $('#div-problema-ajax-loading').show();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.info.equino.php",
                crossDomain: true,
                data: sData,
                success: function (sRespuesta) {
                    var oJson = $.parseJSON(sRespuesta);
                    $("#tableEquinoProbTbody").html(armarTrEquinoProb(oJson));
                    //Limpiar lista de evoluciones
                    $("#divListEvol").html("");
                    $('#div-problema-ajax-loading').hide();

                }
            });
        });

        var aux = ([
            '#tableUltEquinosTbody',
            '#divAltaProbHeader',
            '#divAltaEvolHeader',
            '#divAltaEstudioArchivoHeader'
        ]).join(",");

        $(aux).delegate(".aVerEquino,.btnVerEquino", "click", function () {
            var idEquino;
            idEquino = $(this).attr("data-ie");

            verEquino(idEquino,function(){
                $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino", {allowSamePageTransition: true});
            });
        });

        $("#btnVerUltEquinos,.btnVerUltEquinos").on("click", function () {

            $.ajax({
                type: "POST",
                url: sHost + "ajx.list.ult_equinos.php",
                crossDomain: true,
                success: function (sRespuesta) {
                    var oJson = $.parseJSON(sRespuesta);
                    $("#tableUltEquinosTbody").html(armarTrEquinoUltimos(oJson));
                }
            });
        });

        $("#aVerTodosEquinos").on("click", function () {

            $("#div-ultequinos-ajax-loading").show();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.list.equinos.php",
                crossDomain: true,
                success: function (sRespuesta) {
                    var oJson = $.parseJSON(sRespuesta);
                    $("#tableUltEquinosTbody").html(armarTrEquinos(oJson));
                    $("#div-ultequinos-ajax-loading").hide();
                }
            });
        });

        $("#btnVerClientes,.btnVerClientes").on("click", function () {

            $('#div-clientes-ajax-loading').show();
            $("#tableClientesTbody").html('');

            $.ajax({
                type: "POST",
                url: sHost + "ajx.list.clientes.php",
                crossDomain: true,
                success: function (sRespuesta) {
                    var oJson = $.parseJSON(sRespuesta);
                    $("#tableClientesTbody").html(armarTrClientes(oJson));
                    $('#div-clientes-ajax-loading').hide();
                }
            });

        });


        $("#btn-estudios-list-pendientes").on("click", function(){
            cargarListadoEstudiosPendientes('');
        });
        $("#btn-alta-estudio-archivo-back").on("click", function(){
            var sIdFrm = "#frmAltaEstudioArchivo";
            $(sIdFrm).each(function () {
                this.reset();
            });
            cargarListadoEstudiosPendientes(function(){
                $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_estudios_pendientes", {allowSamePageTransition: true});
            });
        });



        var aux = ([
            '#tbody-estudios-problemas',
            '#tbody-estudios-evoluciones',
            '#tbody-estudios-tot',
            '#tableEquinoProbTbody'
        ]).join(",");

        $(aux).delegate('.linkVerImgEstudio','click',function(event){
            event.preventDefault();
            var src = sPathImage + $(this).attr('data-img-src');
            $('#popupPhotoPortrait').find('img').attr('src',src);

        });


        var aux = ([
            '#tableEquinoProbTbody',
            '#divListEvol'
        ]).join(",");

        $(aux).delegate('.btn-ver-img-estudio','click',function(event){
            event.preventDefault();
            var src = $(this).attr("data-src");
            var estudioDoctorNombre= $(this).attr("data-doctor-nombre");
            var estudioObs = $(this).attr("data-obs");

            $("#div-estudio-doctor-nombre").show().text(estudioDoctorNombre);
            $("#div-estudio-obs").show().text(estudioObs);
            $("#img-estudio").attr('src',src);
            $("#img-estudio-popup").attr('src',src);
            $("#div-img-estudio").show();
        });


        ///////////////////
        //BOTONES GUARDAR//
        ///////////////////

        $('input[type=file]').on('change', prepareUpload);

        $("#btnGuardarArchivo").on("click",function(event){
            if(files){

                var data = new FormData();// Create a formdata object and add the files
                var sIdFrm = "#frmAltaEstudioArchivo";
                var datosFrm = $(sIdFrm).serializeArray();

                $.each(files, function(key, value){
                    data.append(key, value);
                });

                $.each(datosFrm,function(key,object){
                    data.append(object.name, object.value);
                });

                $.ajax({
                    url: sHost + "ajx.alta.estudio_archivo.php?files",
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function(oJson)
                    {
                        if (oJson.br) {
                            $(sIdFrm).each(function () {
                                this.reset();
                            });
                            $("#pEquinoEstudioArchivoAjxResp").text(oJson.sr).css("color", "#000000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                            cargarListadoEstudiosPendientes(function(){
                                $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_estudios_pendientes", {allowSamePageTransition: true});
                            });


                        } else {
                            $("#pEquinoEstudioArchivoAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                        }


                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        $("#pEquinoEstudioArchivoAjxResp").text(textStatus).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                    }
                });

            }else{
                $("#pEquinoEstudioArchivoAjxResp").text("Seleccione un archivo").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
            }

        });

        $("#mod_btnGuardarCliente").on("click", function () {
            var sIdFrm = "#frmModifiCliente";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.mod.cliente.php",
                crossDomain: true,
                data: sDatosFrm
            }).done(function (sJson) {
                var oJson = $.parseJSON(sJson);

                if (oJson.br) {
                    $("#pModCliAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);
                    cargarComboClienteAjx(function(){
                        $(":mobile-pagecontainer").pagecontainer("change", "#home", {allowSamePageTransition: true});
                    });
                } else {
                    $("#pModCliAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                }
            }).fail(function(){
                alert('Error al enviar los datos');
            });

        });

        $("#mod_btnGuardarEquino").on("click", function () {
            var sIdFrm = "#frmModifiEquino";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.mod.equino.php",
                crossDomain: true,
                data: sDatosFrm,
                success: function (sJson) {
                    var oJson = $.parseJSON(sJson);
                    if (oJson.br) {
                        $("#pModEquinoAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);
                    } else {
                        $("#pModEquinoAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                    }
                }
            });
        });

        $("#btnGuardarCliente").on("click", function () {
            var sIdFrm = "#frmAltaCliente";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.alta.cli.php",
                crossDomain: true,
                data: sDatosFrm
            }).done(function (sJson) {
                var oJson = $.parseJSON(sJson);
                if (oJson.br) {

                    $(sIdFrm).each(function () {
                        this.reset();
                    });

                    $("#pCliAjxResp").text(oJson.sr).css("color", "#000000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                    cargarComboClienteAjx(function(){
                        $(":mobile-pagecontainer").pagecontainer("change", "#home", {allowSamePageTransition: true});
                    });

                } else {
                    $("#pCliAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                }
            }).fail(function(){
                alert('Error al enviar los datos');
            });
        });

        $("#btnGuardarEquino").on("click", function () {
            var sIdFrm = "#frmAltaEquino";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.alta.equino.php",
                crossDomain: true,
                data: sDatosFrm,
                success: function (sJson) {
                    var oJson = $.parseJSON(sJson);
                    if (oJson.br) {
                        $(sIdFrm).each(function () {
                            this.reset();
                        });
                        $("#pEquinoAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);
                    } else {

                        $("#pEquinoAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                    }
                }
            });
        });

        $("#btnGuardarGenetica").on("click", function () {

            var sIdFrm = "#frmAltaGenetica";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.alta.equino_gen.php",
                crossDomain: true,
                data: sDatosFrm
            }).done(function (sJson) {

                var oJson = $.parseJSON(sJson);

                if (oJson.br) {
                    $(sIdFrm).each(function () {
                        this.reset();
                    });
                    $("#pEquinoGenAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);

                    cargarComboGeneticaAjx();

                } else {
                    $("#pEquinoGenAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                }
            }).fail(function(){
                $("#pEquinoGenAjxResp").text('Error al enviar los datos').css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
            });

        });

        $("#btnGuardarProblema").on("click", function () {
            var sIdFrm = "#frmAltaEquinoProblema";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.alta.equino_prob.php",
                crossDomain: true,
                data: sDatosFrm
            }).done(function (sJson) {

                var oJson = $.parseJSON(sJson);

                if (oJson.br) {
                    var idEquino = $("#inptHideIE").attr("value");
                    $(sIdFrm).each(function () {this.reset();});

                    $("#pEquinoProblemaAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);

                    verEquino(idEquino,function(){
                        $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino", {allowSamePageTransition: true});
                    });

                } else {
                    $("#pEquinoProblemaAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                }
            });

        });

        $("#btnGuardarEvolucion").on("click", function () {
            var sIdFrm = "#frmAltProbEvol";
            var sDatosFrm = $(sIdFrm).serialize();

            $.ajax({
                type: "POST",
                url: sHost + "ajx.alta.prob_evol.php",
                crossDomain: true,
                data: sDatosFrm,
                success: function (sJson) {
                    var oJson = $.parseJSON(sJson);
                    if (oJson.br) {

                        var idEquino = oJson.id_equino;

                        $(sIdFrm).each(function () {
                            this.reset();
                        });
                        $("#pProbEvolAjxResp").text(oJson.sr).fadeOut(1000).fadeIn(500).fadeOut(5000);

                        verEquino(idEquino,function(){
                            $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino", {allowSamePageTransition: true});
                        });


                    } else {
                        $("#pProbEvolAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                    }
                }
            });
        });

        ///////////////////
        //BOTONES ALTAS////
        ///////////////////
        var aux = ([
            '#tbody-estudios-problemas',
            '#tbody-estudios-evoluciones',
            '#tbody-estudios-tot'
        ]).join(",");

        $(aux).delegate('.a-alta-est-archivos','click',function(event){
            event.preventDefault();

            var idEquino = $(this).attr("data-ie");
            var idEstudio = $(this).attr("data-id");
            var equinoNombre = $(this).attr("data-nom-equino");
            var estudioTipo = $(this).attr("data-tipo-estudio");

            $("#inpt-hide-id_estudio").prop("value",idEstudio);
            $("#btn-alta-estudio-archivo-back").attr("data-ie", idEquino);
            $("#estarch_equino").text(equinoNombre);
            $("#estarch_tipo_estudio").text(estudioTipo);


            $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_estudios_archivos", {
                allowSamePageTransition: true
            });

        });


        $("#tableEquinoProbTbody,#divListEvol").delegate(".aEstArchSubida", "click", function (event) {
            event.preventDefault();

            var idEquino = $(this).attr("data-ie");
            var idEstudio = $(this).attr("data-idest");

            $("#inpt-hide-id_estudio").prop("value",idEstudio);
            $("#btn-alta-estudio-archivo-back").attr("data-ie", idEquino);

            $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_estudios_archivos", {
                allowSamePageTransition: true
            });
        });

        $("#tableEquinoProbTbody").delegate(".aEqProbAltaEvol", "click", function (event) {
            event.preventDefault();
            var iIP = $(this).attr("data-ip");
            var idEquino = $(this).attr("data-ie");
            $("#inptHideIP").attr("value", iIP);
            $("#btnAltaEvolBack").attr("data-ie", idEquino);

            var sData = $.param({
                ie: idEquino
            });

            $.ajax({
                type: "POST",
                url: sHost + "ajx.cliente.obt_lugar_xie.php",
                crossDomain: true,
                data: sData,
                success: function (sRespuesta) {
                    var sIdAux;
                    var sSelector;
                    var oJson = $.parseJSON(sRespuesta);
                    var il = oJson.il;
                    var estadoActivo = 1;

                    sIdAux = "#evol_id_lugar";
                    sSelector = ([sIdAux, '>option[value="', il, '"]']).join("");

                    $(sSelector).prop('selected', true);
                    $(sIdAux).selectmenu();
                    $(sIdAux).selectmenu('refresh');

                    $("#evol_id_estado").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

                    $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_evolucion", {
                        allowSamePageTransition: true
                    });

                }
            });

        });

        $("#tableUltEquinosTbody,#thInfEqAltaProb").delegate(".aAltaProb", "click", function () {
            var idEquino = $(this).attr("data-ie");
            $("#inptHideIE").attr("value", idEquino);
            $("#btnAltaProbBack").attr("data-ie", idEquino);

            $("#prob_id_estado").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

            $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_problema", {
                allowSamePageTransition: true
            });
        });

        $("#btnAltaEquino").on("click", function () {

            var stringSelector = ([
                "#alt_eq_id_sexo",
                "#alt_eq_id_padrillo",
                "#alt_eq_id_madre",
                "#alt_eq_id_abuelo",
                "#alt_eq_id_duenio"
            ]).join(",");

            $(stringSelector).prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

        });

        $("#tableUltEquinosTbody,#thInfEqAltaProb").delegate(".aEqAltaProb", "click", function (event) {

            event.preventDefault();

            var idEquino = $(this).attr("data-ie");
            var sData = $.param({
                ie: idEquino
            });

            $.ajax({
                type: "POST",
                url: sHost + "ajx.cliente.obt_lugar_xie.php",
                crossDomain: true,
                data: sData,
                success: function (sRespuesta) {
                    var sIdAux, sSelector;
                    var oJson = $.parseJSON(sRespuesta);
                    var il = oJson.il;
                    sIdAux = "#prob_id_lugar";
                    sSelector = ([sIdAux, '>option[value="', il, '"]']).join("");
                    $(sSelector).prop('selected', true);
                    $(sIdAux).selectmenu();
                    $(sIdAux).selectmenu('refresh');

                }
            });

        });

        ///////////////////
        //BOTONES EDITAR///
        ///////////////////

        $("#tableClientesTbody").delegate(".aEditarCliente", "click", function (event) {
            event.preventDefault();

            var iIC = $(this).attr("data-ic");
            var sData = $.param({
                ic: iIC
            });

            $.ajax({
                type: "POST",
                url: sHost + "ajx.infodb.mod.cliente.php",
                crossDomain: true,
                data: sData,
                success: function (sRespuesta) {
                    var sSelector, sIdAux;
                    var oJson = $.parseJSON(sRespuesta);

                    if (oJson.bInfoCli) {
                        $("#inptModHideIC").prop("value", oJson.infoCli.id);
                        $("#mod_cli_nombre").prop("value", oJson.infoCli.nombre);
                        $("#mod_cli_direccion").prop("value", oJson.infoCli.direccion);
                        $("#mod_cli_telefono").prop("value", oJson.infoCli.telefono);
                        $("#mod_cli_celular").prop("value", oJson.infoCli.celular);
                        $("#mod_cli_email").prop("value", oJson.infoCli.email);

                        sIdAux = "#mod_cli_id_provincia";
                        sSelector = ([sIdAux, '>option[value="', oJson.infoCli.id_provincia, '"]']).join("");
                        $(sSelector).prop('selected', true);
                        $(sIdAux).selectmenu();
                        $(sIdAux).selectmenu('refresh');

                        sIdAux = "#mod_cli_id_lugar";
                        sSelector = ([sIdAux, '>option[value="', oJson.infoCli.id_lugar, '"]']).join("");
                        $(sSelector).prop('selected', true);
                        $(sIdAux).selectmenu();
                        $(sIdAux).selectmenu('refresh');

                        var sData = $.param({
                            ip: oJson.infoCli.id_provincia
                        });

                        $.ajax({
                            type: "POST",
                            url: sHost + "ajx.cmb.loc.php",
                            crossDomain: true,
                            data: sData,
                            success: function (sRespuesta) {
                                var sOpcion = "";
                                var sSelected = "";

                                $.each($.parseJSON(sRespuesta), function (fila, oJson) {
                                    sOpcion += (['<option value="', oJson.v, '" ', sSelected, ' >', oJson.t, '</option>']).join("");
                                });

                                sIdAux = "#mod_cli_id_localidad";
                                $(sIdAux).html(sOpcion).selectmenu("refresh");
                                sSelector = ([sIdAux, '>option[value="', oJson.infoCli.id_localidad, '"]']).join("");
                                $(sSelector).prop('selected', true);
                                $(sIdAux).selectmenu();
                                $(sIdAux).selectmenu('refresh');

                            }
                        });

                        $(":mobile-pagecontainer").pagecontainer("change", "#pag_modifi_cliente", {
                            allowSamePageTransition: true
                        });

                    } else {
                        console.log("Error al buscar cliente");
                    }

                }
            });

        });

        $("#tableEquinoDataTbody").delegate("#aEditarEquino", "click", function (event) {
            event.preventDefault();

            var idEquino = $(this).attr("data-ie");
            var sData = $.param({
                ie: idEquino
            });

            $.ajax({
                type: "POST",
                url: sHost + "ajx.infodb.mod.equino.php",
                crossDomain: true,
                data: sData
            }).done(function (sRespuesta) {

                var oJson;
                oJson = $.parseJSON(sRespuesta);

                if (oJson.bInfoEq) {

                    $("#inptModHideIE").prop("value", oJson.infoEq.id);
                    $("#mod_nombre").prop("value", oJson.infoEq.nombre);
                    $("#mod_obs").prop("value", oJson.infoEq.obs);
                    $("#mod_nacimiento").prop("value", oJson.infoEq.nacimiento);

                    setOptionSelected("#mod_id_duenio",oJson.infoEq.id_duenio);
                    setOptionSelected("#mod_id_sexo",oJson.infoEq.id_sexo);
                    setOptionSelected("#mod_id_padrillo",oJson.infoEq.id_padrillo);
                    setOptionSelected("#mod_id_madre",oJson.infoEq.id_madre);
                    setOptionSelected("#mod_id_abuelo",oJson.infoEq.id_abuelo);

                    $(":mobile-pagecontainer").pagecontainer("change", "#pag_modifi_equino", {
                        allowSamePageTransition: true
                    });

                } else {
                    alert("Error al buscar Equino");
                }

            });

        });

        ///////////////////
        //BOTON LOGIN//////
        ///////////////////

        $("#btnLogin").on("click", function () {
            var sIdFrm = "#frmLogIn";
            var sDatosFrm = $(sIdFrm).serialize();



            $.ajax({
                type: "POST",
                url: sHost + "ajx.login.php",
                crossDomain: true,
                data: sDatosFrm,
                success: function (sJson) {
                    var oJson = $.parseJSON(sJson);

                    if (oJson.br) {

                        ithStorage.setItem("login", 1);

                        $(sIdFrm).each(function () {
                            this.reset();
                        });
                        $(":mobile-pagecontainer").pagecontainer("change", "#home", {
                            allowSamePageTransition: true
                        });

                    } else {

                        ithStorage.setItem("login", 0);
                        $("#pLoginAjxResp").text(oJson.sr).css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);

                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#pLoginAjxResp").text("Error de conexión").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                }
            });
        });

        /////////////////////////
        //BOTON IMPORTACION//////
        /////////////////////////

        //Importacion de los datos del servidor
        $("#btnImpInfServer").click(function(){
            var r = confirm("Se importaran datos del servidor, la informacion local se pisara.¿Desea importar datos?.");
            if (r == true) {
                importarInfoServer();
            }
        });

        /////////////////////////
        //BOTON EXPORTACION//////
        /////////////////////////

        $("#btn-exportar-offline").click(function(){
            $("#div-export-online-msj").text("Procesando...").css("color", "#008CBA")
                .fadeOut(500)
                .fadeIn(500)
                .fadeOut(500)
                .fadeIn(500);

            cargarExportacion(sendExport);

        });

    });

}

function verEquino(idEquino,cb)
{
    var sData = $.param({
        ie: idEquino,
        lp: true
    });

    $("#div-equinodata-ajax-loading").show();
    $("#tableEquinoDataTbody").html('');
    $("#tableEquinoProbTbody").html('');

    $.ajax({
        type: "POST",
        url: sHost + "ajx.info.equino.php",
        crossDomain: true,
        data: sData

    }).done(function (sRespuesta) {

        var oJson = $.parseJSON(sRespuesta);
        var idEquino = (oJson.bInfoEq) ? oJson.infoEq.equino_id : "";
        $("#aInfEqAltaProb,#aInfEqVerProbs").attr("data-ie", idEquino);
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

        if(!empty(cb)){ cb(); }

        $("#div-equinodata-ajax-loading").hide();

    });
}