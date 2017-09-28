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
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

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
    switch (cmd) {
      case "shutdown -r -t 0":
    //if (cmd == "shutdown -r -t 0"){
          bot.reply(message, 'Comando `shutdown` detectado... espera');
          const exec = require('child_process').exec;
          var command = "psexec.py "+"'"+USER+"':"+"'"+PASS+"'@"+IP+" cmd /c '"+cmd+"'"+' |egrep -v "^\\[\\*|Impacket|\\[!"';
          const child = exec(command,
                        (error, stdout, stderr) => {
                            var output = stdout;
                            if (output) {
                              bot.reply(message, '```output```\n```---------------------------------'+output+'```');
                                /*bot.reply(message, 'Iniciando monitor... espera');
                                const execMonitor = require('child_process').execMonitor;
                                var commandMonitor = "/home/ubuntu/start_monitor.sh 2>/dev/nul";
                                const child2 = exec(commandMonitor,
                                    (error, stdout, stderr) => {
                                        var output2 = stdout;
                                        if (output2) {
                                          bot.reply(message, '```output```\n```---------------------------------'+output2+'```');
                                        } else {
                                            bot.reply(message, 'No pude obtener respuesta');
                                        }
                                        console.log('stderr: ${stderr}');
                                    });*/
                            } else {
                                bot.reply(message, 'No pude obtener respuesta');
                            }
                            console.log('stderr: ${stderr}');
                        });
        break;

      default:
    //}else{
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
        break;
    }//switch
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

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
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
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
