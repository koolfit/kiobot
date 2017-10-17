var debug = require('debug')('mod_openstackconvos');
controller.hears('(reinicia) (servidor|server|host|VM|instancia|server) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        var servername=message.match[3];
        console.log("Command REBOOT heard!!!");
        let {name, real_name} = response.user;
            var requestID="reboot_"+servername+"_"+name+"-"+Date.now();
            mensajeRequester={"text":"@"+name+", he recibido tu petición para reiniciar el servidor "+servername+".\nNotificaré al grupo #Admin para su autorización",
                            "channel" : message.user
                }
            mensajeAdmin={"text":":closed_lock_with_key: :bangbang: Autorizacion requerida",
                          "channel": "#monitor",
                    "attachments": [
                    {
                        "text": "Hola grupo Admin. He recibido una petición que requiere autorización.",
                        "fallback": "Attachment type not supported",
                        "callback_id": requestID,
                        "color": "warning",
                        "attachment_type": "default",
                        "response_type" : "ephemeral",
                        "replace_original" : true,
                        "fields" : [
                            {
                                "title" : "Solicitante",
                                "value" : "@"+name,
                                "short" : true
                            },
                            {
                                "title" : "Comando",
                                "value" : "reboot",
                                "short" : true
                            },
                            {
                                "title" : "Host",
                                "value" : servername,
                                "short" : true
                            },
                            {
                                "title" : "Infraestructura",
                                "value" : "bessel",
                                "short" : true
                            }
                            
                        ],
                        "actions": [
                            {
                                "name": "yes",
                                "text": "Autorizar Reinicio",
                                "type": "button",
                                "style" : "danger",
                                "value": "yes",
                                "confirm": {
                                    "title": "Confirmación para el reinicio del servidor.",
                                    "text": "Seguro que desea autorizar el reinicio del servidor "+servername+"?",
                                    "ok_text": "Si",
                                    "dismiss_text": "No"
                                
                                }
                            },
                            {
                                "name": "no",
                                "text": "Rechazar petición",
                                "type": "button",
                                "value": "no"
                            }
                        ]
                    }
                    ]
                    };
                        
            bot.reply(message, mensajeRequester);
            bot.say(mensajeAdmin);
        })
});

controller.hears('(opciones) (servidor|server|host|VM|instancia|server) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        var servername=message.match[3];
        console.log("Command OPTIONS heard!!!");
        let {name, real_name} = response.user;
            var requestID="options"+servername+"_"+name+"-"+Date.now();
            
            mensaje={"text":"Hola @"+name+", a continuación te envío la información del servidor "+servername,
                            "channel" : message.user,
                    "attachments": [
                    {
                        "text": "Datos del servidor "+servername,
                        "fallback": "Attachment type not supported",
                        "callback_id": requestID,
                        "color": "good",
                        "attachment_type": "default",
                        "response_type" : "ephemeral",
                        "replace_original" : true,
                        "fields" : [
                            {
                                "title" : "Solicitante",
                                "value" : "@"+name,
                                "short" : true
                            },
                            {
                                "title" : "Comando",
                                "value" : "reboot",
                                "short" : true
                            },
                            {
                                "title" : "Host",
                                "value" : servername,
                                "short" : true
                            },
                            {
                                "title" : "Infraestructura",
                                "value" : "bessel",
                                "short" : true
                            }
                            
                        ],
                        "actions": [
                            {
                                "name": "yes",
                                "text": "Autorizar Reinicio",
                                "type": "button",
                                "style" : "danger",
                                "value": "yes",
                                "confirm": {
                                    "title": "Confirmación para el reinicio del servidor.",
                                    "text": "Seguro que desea autorizar el reinicio del servidor "+servername+"?",
                                    "ok_text": "Si",
                                    "dismiss_text": "No"
                                
                                }
                            },
                            {
                                "name": "no",
                                "text": "Rechazar petición",
                                "type": "button",
                                "value": "no"
                            }
                        ]
                    }
                    ]
                    };
                        
            bot.reply(message, mensajeRequester);
            bot.say(mensajeAdmin);
        })
});

controller.on('interactive_message_callback', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
        var callback_elements = message.callback_id.split("-");
        var callback_parameters = callback_elements[0].split("_");
        var command = callback_parameters[0];
        var servername = callback_parameters[1];
        var requestername = callback_parameters[2];
        var replytext="";
        var footer="";
        var action="";
        Fecha=new Date(Date.now());
        var timestmp=Fecha.getFullYear()+"/"+(Fecha.getMonth()+1)+"/"+(Fecha.getDay()+1)+", "+Fecha.getHours()+":"+Fecha.getMinutes();
        if (message.actions[0].value=='yes') {
                    replytitle=":white_check_mark: Petición AUTORIZADA por "+name;
                    replytext="Se ha recibido autorizacion de esta petición ("+name+": "+timestmp+")";
                    displaytype="good"
                    action=":white_check_mark: Se está enviando el comando reboot al servidor "+servername+"...";
        }
        if (message.actions[0].value=='no') {
                    replytitle=":no_entry: Petición RECHAZADA por "+name;
                    replytext=":cruz_negativa_enmarcada: Se ha denegado la autorización de esta petición ("+name+": "+timestmp+")";
                    displaytype="danger"
                    action=":no_entry: NO se reiniciará el servidor "+servername+".";
                }
        var reply = {
            text: replytitle,
            "attachments": [
                    {
                        "text": replytext,
                        "fallback": "Attachment type not supported",
                        "color": displaytype,
                        "attachment_type": "default",
                        "response_type" : "ephemeral",
                        "replace_original" : true,
                        "fields" : [
                            {
                                "title" : "Solicitante",
                                "value" : "@"+requestername,
                                "short" : true
                            },
                            {
                                "title" : "Comando",
                                "value" : "reboot",
                                "short" : true
                            },
                            {
                                "title" : "Host",
                                "value" : servername,
                                "short" : true
                            },
                            {
                                "title" : "Infraestructura",
                                "value" : "bessel",
                                "short" : true
                            },
                            {
                                "title" : "Accion:",
                                "value" : action,
                                "short" : false
                            },
                    ]
                }
            ]
        }
        var requestorreply = {
            text: replytitle,
            channel: "@"+requestername,
            "attachments": [
                    {
                        "text": replytext,
                        "fallback": "Attachment type not supported",
                        "color": displaytype,
                        "attachment_type": "default",
                        "response_type" : "ephemeral",
                        "replace_original" : true,
                        "fields" : [
                            {
                                "title" : "Solicitante",
                                "value" : "@"+requestername,
                                "short" : true
                            },
                            {
                                "title" : "Comando",
                                "value" : "reboot",
                                "short" : true
                            },
                            {
                                "title" : "Host",
                                "value" : servername,
                                "short" : true
                            },
                            {
                                "title" : "Infraestructura",
                                "value" : "bessel",
                                "short" : true
                            },
                            {
                                "title" : "Accion:",
                                "value" : action,
                                "short" : false
                            },
                        ],
                }
            ]
        }      
                bot.replyInteractive(message, reply);
                bot.say(requestorreply);
    })
});

controller.hears("capacity",['ambient','direct_message,direct_mention,mention'],function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        debug("Someone said capacity?");
        let {name, real_name} = response.user;
        bot.say('Hola '+name);
        bot.startConversation(message,capacityHeard);
    });
});

capacityHeard=function(response,convo) {
    convo.addQuestion("Acaso mencionaste algo sobre un capacity? Te puedo ayudar con eso!!!",[
      {
        pattern: '(si|ok|claro|dime|cuentame|seguro|como|cómo|por favor|por que no)',
        callback: function(response,convo) {
          convo.say('Bueno, mira: sólo necesito saber de qué infraestructura requieres el capacity y yo lo puedo generar y enviar por correo por tí');
          capacityYes (response, convo);
          convo.next();
        }
      },
      {
        pattern: '(no|olvidalo|nop|nope|nel|ni maiz)',
        callback: function(response,convo) {
          convo.say('Ok, entendido. Si requieres ayuda con los capacity más tarde, solo pregúntame.');
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.say('Disculpa, no entendí.');
          convo.repeat(response,convo);
          convo.next();
        }
      }
    ],{},'default');
}

capacityYes=function(response,convo) {
    convo.addQuestion("Tienes el nombre de la infraestructura, o quieres que te de una lista de las infraestructuras que conozco?",[
      {
        pattern: '(lista|listado|cuales|nombres)',
        callback: function(response,convo) {
          convo.say('Por el momento puedo generar el capacity de las siguientes infraestructuras:');
          convo.say('andromeda\nbessel\ndraco\nfenix\ngemma\nizar\njordan\n');
          convo.say('De qué infraestructura quieres el reporte? Si prefieres lo podemos dejar para más tarde.')
          convo.repeat();
          convo.next();
        }
      },
      {
        pattern: '(andromeda|bessel|draco|fenix|gemma|izar|jordan)',
        callback: function(response,convo) {
          confirmCapacity(response,convo);
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.say('What?');
          convo.repeat();
          convo.next();
        }
      }
    ],{},'default');
}

confirmCapacity=function(response,convo) {
    convo.addQuestion("Quieres que empiece a generar el capacity que pediste, o quieres cancelarlo?",[
      {
        pattern: '(si|sip|por favor|si eres tan amable|claro|yes|eip|yep|generalo|genéralo|ejecutalo|ejecútalo|simon|simón)',
        callback: function(response,convo) {
          convo.say('Ejecutando la generación del reporte!!!')
          convo.next();
        }
      },
      {
        pattern: '(no|nop|nope|cancela|canc[eé]lalo|olv[ií]dalo|nel|ni maiz)',
        callback: function(response,convo) {
          convo.say('Está bien, no lo voy a generar, avísame si cambias de opinión');
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          // just repeat the question
          convo.say('O sea, cómo?.');
          convo.repeat();
          convo.next();
        }
      }
    ],{},'default');
}
