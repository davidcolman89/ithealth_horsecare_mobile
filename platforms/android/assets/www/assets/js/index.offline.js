function offline() {
    $(function () {

        $("#span-estado-app").addClass("dc-estado-offline").text("OFFLINE");

        $(".div-online").hide();


        $(".divFooter").html("VERSION OFFLINE").addClass("divFooterOffline");

        $("#btnLogin").on("click", function () {
            var sIdFrm = "#frmLogIn";
            var aDatosFrm = $(sIdFrm).serializeArray();
            $("#pLoginAjxResp").text(sLeyendaLogin);
            chequearLogInOffline(aDatosFrm, sIdFrm);
        });



        $(document).on("pageshow", "#home,#pag_altas_equino_offline", function (e) {
            e.preventDefault();
            if (!checkSession()) {
                enviarALogIn();
            } else {
                //Combo cliente
                $.get("assets/sql/select.clientes.combo.sql", cargarComboClientesBySQLite);
            }
        });


        $(document).on("pageshow", "#pag_ver_equino_offline", function (e) {
            e.preventDefault();

            if (!checkSession()) {
                enviarALogIn();
            } else {
                $("#div-list-evols").hide();
                var idEquino = $("#vista-eq-id").val();
                var stringSelector = '#tbody-prob-offline';
                listarProblemasOffline(idEquino,stringSelector);

            }

        });

        $(document).on("pageshow", "#pag_altas_problema_offline", function (e) {
            e.preventDefault();
            if (!checkSession()) {
                enviarALogIn();
            } else {
                var idEquino = $("#inpt-hide-ie-offline").val();

                obtenerLugarCliente(idEquino,function(idLugar){
                        setIdLugarComboOffline(idLugar,'#prob_id_lugar-offline');
                });

                $("#prob_id_estado-offline").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');
            }
        });

        $(document).on("pageshow", "#pag_altas_evolucion_offline", function (e) {
            e.preventDefault();
            if (!checkSession()) {
                enviarALogIn();
            } else {
                var idEquino = $("#inpt-hide-ie-offline").val();

                obtenerLugarCliente(idEquino,function(idLugar){
                    setIdLugarComboOffline(idLugar,'#evol_id_lugar-offline');
                });

                $("#evol_id_estado-offline").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');
            }
        });



        /////////////////
        //BOTONES////////
        /////////////////
        $(".btnVerEquino").click(function(event){
            event.preventDefault();

            //redirecciona
            $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino_offline", {
                allowSamePageTransition: true
            });

        });

        $("#a-list-probs-offline").click(function(){
            var idEquino = $("#vista-eq-id").val();
            var stringSelector = '#tbody-prob-offline';
            listarProblemasOffline(idEquino,stringSelector);
        });

        /////////////////
        //SELECT.CHANGE//
        /////////////////

        $("#home_id_cliente").change(function () {
            var iIC = $(this).val();

            $.get("assets/sql/select.equinos.combo.sql", function (sQuery) {
                db.transaction(function (tx) {
                    tx.executeSql(sQuery, [iIC], function (tx, results) {
                        var iLen = results.rows.length;
                        var sOpcion, v, t;
                        sOpcion = (['<option value="">', 'Seleccione Equino', '</option>']).join("");

                        for (var i = 0; i < iLen; i++) {
                            v = results.rows.item(i).value;
                            t = results.rows.item(i).text;
                            sOpcion += (['<option value="', v, '">', t, '</option>']).join("");
                        }

                        $("#home_id_equino").html(sOpcion).selectmenu("refresh");

                    });
                }, dbError, dbExito);
            });

        });

        $("#home_id_equino").change(function () {
            var idEquino = $(this).val();

            //Limpia los combos clientes/equinos
            $(this).find('option').remove();
            $(this).selectmenu();
            $(this).selectmenu('refresh');
            $("#home_id_cliente").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

            //arma vista del equino
            $.get("assets/sql/select.equino.info.sql", function (sQuery) {
                db.transaction(function (tx) {
                    tx.executeSql(sQuery, [idEquino], function (tx, results) {
                        var iLen = results.rows.length;
                        var bInfoEq = (iLen > 0) ? true : false;
                        var oEquino = {"infoEq": results.rows.item(0), "bInfoEq": bInfoEq};

                        var tr = armarTrEquinoInfoOffline(oEquino);
                        $("#tbody-eq-data-offline").html(tr);
                    });
                }, dbError, dbExito);
            });

            $("#vista-eq-id").attr("value", idEquino);

            //redirecciona
            $(":mobile-pagecontainer").pagecontainer("change", "#pag_ver_equino_offline", {
                allowSamePageTransition: true
            });
        });

        ///////////
        //Delegate/
        ///////////

        $("#th-prob-alta-offline").delegate(".a-alta-prob", "click", function () {
            var idEquino = $("#vista-eq-id").val();
            $("#inpt-hide-ie-offline").attr("value", idEquino);

            $("#prob_id_estado").prop('selectedIndex', 0).selectmenu().selectmenu('refresh');

            $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_problema_offline", {
                allowSamePageTransition: true
            });
        });


        $("#tbody-prob-offline").delegate('.a-nueva-evol','click',function(){
            var idProblema = $(this).attr('data-ip');
            $("#inpt-hide-ip-offline").attr('value',idProblema);

            $(":mobile-pagecontainer").pagecontainer("change", "#pag_altas_evolucion_offline", {
                allowSamePageTransition: true
            });
        });

        $("#tbody-prob-offline").delegate('.a-list-evol','click',function(){

            var idProblema = $(this).attr('data-ip');
            var stringSelector = '#tbody-evols-offline';
            listarEvolucionesOffline(idProblema,stringSelector);
            $("#div-list-evols").show();

        });


        //////////////////
        //Botones Guardar/
        //////////////////


        $("#btn-guardar-cli-offline").on("click", function () {
            var bool = true;
            var nombre = $("#alt_cli_nombre-offline").val();

            if(empty(nombre)){
                $("#pCliAjxResp-offline").text("ingrese el nombre").css("color", "#000000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                bool = false;
            }

            if(bool===true){
                db.transaction(function (tx) {
                    var sQuery = "SELECT MAX(id) AS max_id FROM clientes";
                    tx.executeSql(sQuery, [], insertarCliente);
                }, dbError, dbExito);
            }

        });


        $("#btn-guardar-eq-offline").click(function () {

            var idDiv = "#pEquinoAjxResp-offline";
            var bool = true;
            var nombre = $("#alt_eq_nombre-offline").val();
            var nacimiento = $("#alt_eq_nacimiento-offline").val();
            var duenio = $("#alt_eq_id_duenio-offline").val();

            if(empty(nombre)){
                $(idDiv).text("ingrese el nombre").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                bool = false;
            }
            else if(empty(duenio)){
                $(idDiv).text("ingrese el due\u00f1o").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                bool = false;
            }
            else if(empty(nacimiento)){
                $(idDiv).text("ingrese el nacimiento").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                bool = false;
            }


            if(bool===true){
                db.transaction(function (tx) {
                    var sQuery = "SELECT MAX(id) AS max_id FROM equinos";
                    tx.executeSql(sQuery, [], insertarEquino);
                }, dbError, dbExito);
            }


        });

        $("#btn-guardar-prob-offline").click(function () {

            //var idEstudioTipo = $("#prob_id_estudio_tipo-offline").val();
            var bool = true;
            var idDiv = "#p-prob-resp-offline";
            var fecha = $("#prob_fecha-offline").val();

            if(empty(fecha)){
                $(idDiv).text("ingrese la fecha").css("color", "#cc0000").fadeOut(1000).fadeIn(500).fadeOut(5000);
                bool = false;
            }

            if(bool===true){

                nuevoProblema();

//                if(empty(idEstudioTipo)){
//                    nuevoProblema({idEstudio:''});
//                }else{
//                    var idEstudioTipo = $("#prob_id_estudio_tipo-offline").val();
//                    nuevoEstudio(idEstudioTipo,nuevoProblema);
//                }
            }

        });

        $("#btn-guardar-evol-offline").click(function () {

            nuevaEvolucion({
                id_problema:$("#inpt-hide-ip-offline").val(),
                id_estado:$("#evol_id_estado-offline").val(),
                fecha:$("#evol_fecha-offline").val(),
                id_lugar:$("#evol_id_lugar-offline").val(),
                obs:$("#evol_obs-offline").val(),
                id_estudio:$("#evol_id_estudio_tipo-offline").val(),
                id_medicacion:$("#evol_id_medicacion-offline").val(),
                id_practica:$("#evol_id_practica-offline").val()
            });

//            var idEstudioTipo = $("#evol_id_estudio_tipo-offline").val();
//            if(empty(idEstudioTipo)){
//                nuevaEvolucion({idEstudio:''});
//            }else{
//                var idEstudioTipo = $("#evol_id_estudio_tipo-offline").val();
//                nuevoEstudio(idEstudioTipo,nuevaEvolucion);
//            }

        });



    });

}