//KIOBOT
// Conexion a la libreria de botkit.js
var Botkit = require('/home/ubuntu/node_modules/botkit/lib/Botkit.js');
var os = require('os');

// Se valida el token ID

if (!process.env.token) {
  console.log('Error: Token ID incorrecto!!!');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: true
});


controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

/************    Utterances   ************/

var spanishUtterances_yes = "(s[ií]|sip|claro|va|yes|ok|yeah)";
var spanishUtterances_no = "(no|nel|nah|nop|nope|ni maiz)";

/************    Comienzan instrucciones para infra de Tribunal ************/

/************    Ceph Fenix ************/

controller.hears(['fenix ceph'], 'direct_message,direct_mention',  function(bot, message) {
    const exec = require('child_process').exec;
    const child = exec('ssh kftadmin@fenix -p65535 "sudo ceph -s"',
                  (error, stdout, stderr) => {
                      var ceph_output = stdout;
                      bot.reply(message, '```'+ceph_output+'```');
                      console.log('stderr: ${stderr}');
                  });
    ceph_output = "";

});

/************    VNC  Fenix ************/

controller.hears('fenix novnc (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    var name_instance = message.match[1];

    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@fenix -p65535 "sudo -i bash -ic novnc '+name_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      bot.reply(message, '```'+output+'```');
                      console.log('stderr: ${stderr}');
                  });
});

/************    Get Name  Fenix ************/

controller.hears('fenix get name (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@fenix -p65535 "sudo -i bash -ic getNamebyIP '+ip_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, ':( no pude encontrar alguna instancia con esa IP');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Get ID  Fenix ************/

controller.hears('fenix get id (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@fenix -p65535 "sudo -i bash -ic getIDbyIP '+ip_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, ':( no pude encontrar alguna instancia con esa IP');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Nova service-list  Fenix ************/

controller.hears('fenix nova service-list', 'direct_message,direct_mention,mention', function(bot, message) {
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@fenix -p65535 "sudo -i bash -ic nova_service_list 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Infrastructure Capacity  Fenix ************/

controller.hears('(.*) capacity', 'direct_message,direct_mention,mention', function(bot, message) {
	var infra = message.match[1];
	//bot.reply(message, message.match[1]);
	if (infra == "bessel" || infra == "fenix" || 
		infra == "enel" || infra == "jordan" || 
		infra == "earth"  || infra == "andromeda" || 
		infra == "izar" || infra == "draco") {
	    bot.reply(message, '`'+infra+'` - Generando correo con información ... espera');
	    const exec = require('child_process').exec;
	    var command = 'ssh kftadmin@'+infra+' -p65535 "sudo -i bash -ic /root/infrastructureCapacity.sh 2>/dev/null"';
	    const child = exec(command,
	                  (error, stdout, stderr) => {
	                      var output = stdout;
	                      if (output) {
	                          bot.reply(message, '`'+infra+'` - Correo enviado.');
	                      } else {
	                          bot.reply(message, 'No pude obtener respuesta de: `'+infra+'`');
	                      }
	                      console.log('stderr: ${stderr}');
	                  });
	} else { 
		bot.reply(message, 'Infraestructura inválida');
	}
});

/************    Terminan instrucciones para infra de Tribunal ************/

/************    Comienzan instrucciones para infra de GOBMX ************/

/************    Nova service-list  GOBMX ************/

controller.hears('jordan nova service-list', 'direct_message,direct_mention,mention', function(bot, message) {
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@10.52.30.10 -p65535 "sudo -i bash -ic nova_service_list 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Protocolo de incidencias  GOBMX ************/

controller.hears(['jordan graficas', 'jordan gráficas'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Generando gráficas ... espera');
    const exec = require('child_process').exec;
    var command = "ssh kftadmin@10.52.30.11 -p65535 \"/usr/local/bin/generate_zabbix_graphs_day.sh\" 2>/dev/null";
     const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, 'Gráficas generadas!');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Terminan instrucciones para infra de GOBMX ************/

/************    Instrucciones para Menu de ayuda ************/

controller.hears(['help', 'ayuda'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
		var help = 'Hola @'+name+', estos son los comandos que puedo recibir:\n\n';
        help += '*Ya puedo generar las gráficas del Protocolo de Incidencias de GOB.MX!*\n\n\n';
    	help += '*Obtener URL de novnc*: `<infraestructura> novnc <nombre instancia>`\n';
    	help += 'ejemplo: `fenix novnc TEST_KPP`\n\n\n';
        help += '*Obtener el estatus de Ceph*: `<infraestructura> ceph`\n';
    	help += 'Para Tribunal también hay un `fenix cephkpp` _(Cluster 2 de Ceph)_\n\n\n';
        help += '*Obtener el nombre de la instancia a partir de la IP*: `<infraestructura> get name <IP>`\n';
        help += 'ejemplo: `fenix get name 10.10.21.36`\n\n\n';
        help += '*nova service-list*: `<infraestructura> nova service-list`\n\n\n';
        help += '*Obtener el ID de la instancia a partir de la IP*: `<infraestructura> get id <IP>`\n';
        help += 'ejemplo: `fenix get id 10.10.21.36`\n\n\n';
        help += '*Obtener gráficas del protocolo de incidencias:* `jordan gráficas`\n\n\n';
        help += '*Generar reporte de capacidad de infraestructura:* `<infraestructura> capacity`\n\n\n';
        help += '*Para listar las infraestructuras disponibles: *`infraestructuras`\n\n\n';
        help += '*Comandos en MS Windows:* `<windows> .*`\n\n\n';
        help += '*Screenshot de consola VM:* `<screenshot> .*`\n\n\n';
    bot.reply(message, help);
	})
});


/***********  Infraestructuras ***********/
controller.hears(['infraestructura', 'infraestructuras', 'Infraestructura', 'Infraestructuras'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
    var help = '*Infraestructuras disponibles:* \n\n'
        help += '`fenix` = *TSJCDMX*\n';
        help += '`jordan` = *GobMX*\n';
        help += '`bessel` = *SFE Multitenant*\n';
        help += '`andromeda` = *IMSS*\n';
        help += '`gemma` = *ENEL*\n';
        help += '`earth` = *SportsWorld*\n';
        help += '`izar` = *Excelsior*\n';
        help += '`draco` = *Soriana*\n';

    bot.reply(message, help);
  })
});


/***********  Saludos ***********/
controller.hears(['Hola','hola'], 'ambient', function(bot, message) {
    var hi_messages = ['hola',
                       'buen día',
                       'cómo estás?',
                       'que onda',
                       'Hola'];
    var randMessage = hi_messages[Math.floor(Math.random() * hi_messages.length)];
    bot.reply(message, randMessage);
});

/***********  Fecha ***********/

controller.hears('date', 'direct_message,direct_mention,mention', function(bot, message) {
    var d = new Date();
    date = d.toDateString();
    //bot.reply(message, 'The date is '+date+'.');
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
        //console.log(name, real_name);
        bot.reply(message, "@"+name+" the date is "+date);
    })
});


/*********** WINDOWS TEST ***********/
//cmd /c "systeminfo | findstr "System Boot"

controller.hears('windows (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var cmd = message.match[1];
	bot.reply(message, '`'+cmd+'`');
		var USER = "Administrator";
		var PASS = "A1q2w3e$";
		var IP = "10.49.5.233";
    //switch (cmd) {
      //case "shutdown -r -t 0":
    if (cmd == "shutdown -r -t 0"){
          bot.reply(message, 'Comando `shutdown` detectado... espera');
          const exec = require('child_process').exec;
          var command = "/home/ubuntu/start_monitor.sh;sleep 1;psexec.py "+"'"+USER+"':"+"'"+PASS+"'@"+IP+" cmd /c '"+cmd+"'"+' |egrep -v "^\\[\\*|Impacket|\\[!"';
          const child = exec(command,
                        (error, stdout, stderr) => {
                            var output = stdout;
                            if (output) {
                              //bot.reply(message, '```output```\n```---------------------------------'+output+'```');
                                  var api_command = "screenshot x";
                                  var execScreenshot = require('child_process').execScreenshot;
                                  var commandScreenshot = '/home/ubuntu/get_winexec_screenshot.sh "'+api_command+'" 2>/dev/null';
                                  var filename;
                                  bot.reply(message,{text: 'Máquina Virtual reiniciada, generando screenshot de la consola... espera'});
                                  var childScreenshot = exec(commandScreenshot,
                                            (error, stdout, stderr) => {
                                                var output = stdout;
                                                if (output) {
                                                  var fs = require('fs');
                                                  filename= output;
                                                  bot.api.files.upload({
                                                    token: process.env.token,
                                                    title: "Screenshot",
                                                    filename: output,
                                                    filetype: "auto",
                                                    //content: "Posted with files.upload API",
                                                    file: fs.createReadStream(filename),
                                                    channels: message.channel
                                                  }, function(err, response) {
                                                    if (err) {
                                                      console.log("Error (files.upload) " + err);
                                                    } else {
                                                      console.log("Success (files.upload) " + response);
                                                    };
                                                  });
                                                }
                                                else {
                                                    bot.reply(message, ':( Hubo un error al invocar la API');
                                                }
                                                console.log('stderr: +${stderr}');
                                            });
                             } else {
                                bot.reply(message, 'No pude obtener respuesta');
                            }
                            console.log('stderr: ${stderr}');
                        });
        //break;

      //default:
    }else{
          //const exec = require('child_process').exec;
    		  bot.reply(message, 'Ejecutando comando... espera');
          const exec = require('child_process').exec;
          var command = "psexec.py "+"'"+USER+"':"+"'"+PASS+"'@"+IP+" cmd /c '"+cmd+"'"+' |egrep -v "^\\[\\*|Impacket|\\[!"';
          const child = exec(command,
                    (error, stdout, stderr) => {
                        var output = stdout;
                        if (output) {
                          bot.reply(message, '```output```\n```---------------------------------'+output+'```');
                        } else {
                            bot.reply(message, 'No pude obtener respuesta');
                        }
                        console.log('stderr: ${stderr}');
                    });
    }
});

controller.hears('win (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var cmd = removeDiacritics(message.match[1]);
  //var cmdWin = message.match[1][1];
  //var msg = message.match[0];
  bot.reply(message, '`'+cmd+'`');
  //if (opt == "windows-1" || opt == "windows-2") {
    var USER = "Administrator";
    var PASS = "A1q2w3e$";
    var IP = "10.49.5.233";
    bot.reply(message, 'Ejecutando comando... espera');
      const exec = require('child_process').exec;
      var command = "psexec.py "+"'"+USER+"':"+"'"+PASS+"'@"+IP+" cmd /c '"+cmd+"'"+' |egrep -v "^\\[\\*|Impacket|\\[!"';
      const child = exec(command,
                    (error, stdout, stderr) => {
                        var output = stdout;
                        if (output) {
                          bot.reply(message, '```output```\n```---------------------------------'+output+'```');
                        } else {
                            bot.reply(message, 'No pude obtener respuesta');
                        }
                        console.log('stderr: ${stderr}');
                    });
  //} else {
  //  bot.reply(message, 'Selección inválida');
  //}

});

/*********** CONSOLE SCREENSHOT ***********/
/*********** TEST ***********/

controller.hears('screenshot (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
        var api_command = message.match[1];
        const exec = require('child_process').exec;
        var command = '/home/ubuntu/get_winexec_screenshot.sh "'+api_command+'" 2>/dev/null';
        var filename;
        bot.reply(message,{text: 'Generando screenshot... espera'});
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                        var fs = require('fs');
                        filename= output;
                        bot.api.files.upload({
                          token: process.env.token,
                          title: "Screenshot",
                          filename: output,
                          filetype: "auto",
                          //content: "Posted with files.upload API",
                          file: fs.createReadStream(filename),
                          channels: message.channel
                        }, function(err, response) {
                          if (err) {
                            console.log("Error (files.upload) " + err);
                          } else {
                            console.log("Success (files.upload) " + response);
                          };
                        });
                      }
                      else {
                          bot.reply(message, ':( Hubo un error al invocar la API');
                      }
                      console.log('stderr: +${stderr}');
                  });
});


/*********** BOT TALK ***********/

controller.hears(['hello', 'hi', 'hola'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Falla al agregar reacción con emoji :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hola ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hola.');
        }
    });
});

controller.hears(['me llamo (.*)', 'yo soy (.*)', 'dime (.*)', 'mi nombre es (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Lo tengo. Te llamaré ' + user.name + ' desde ahora.');
        });
    });
});

controller.hears([/^(qui[eé]n soy|c[óo]mo me llamo|d[íi] mi nombre)/i], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Tu nombre es ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('Aún no sé tu nombre!');
                    convo.ask('Cómo debería llamarte?', function(response, convo) {
                        convo.ask('Quieres que te llame `' + response.text + '`?', [
                            {
                                pattern: new RegExp(/^(si|sí|sip|s|claro|va|yes|ok|y|yeah)/i),
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: new RegExp(/^(no|nel|nah|nop|nope|n)/i),
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! Actualizaré mis registros...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Lo tengo. Te llamaré ' + user.name + ' desde ahora.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, no importa!');
                        }
                    });
                }
            });
        }
    });
});

///^[a-zA-Z\u00C0-\u017F]+,\s[a-zA-Z\u00C0-\u017F]+$/

//controller.hears(['shutdown','apagar','apagate','adios','ciao'], 'direct_message,direct_mention,mention', function(bot, message) {
controller.hears([/^(shutdown|apagar|ap[aá]gate|adi[oó]s|ciao|bye|hasta la vista)/i], 
    'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Estás seguro que quieres apagarme?', [
            {
                //pattern: bot.utterances.yes,
                pattern: spanishUtterances_yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            //pattern: bot.utterances.no,
            pattern: spanishUtterances_no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identificate', 'quien eres', 'cual es tu nombre'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());
        
        bot.reply(message,
            ':robot_face: Soy un *bot* llamado <@' + bot.identity.name +
             '>. He estado activo por ' + uptime + ' en ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'segundo';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minuto';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hora';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = Number(uptime).toFixed(2) + ' ' + unit;
    //uptime + ' ' + unit;
    return uptime;
}




//FUNCIÓN PARA QUITAR ACENTOS DE UN STRING

function removeDiacritics (str) {

  var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
  ];

  for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
    str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
  }

  return str;

}
