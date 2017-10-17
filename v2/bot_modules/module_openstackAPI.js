var debug = require('debug')('mod_openstackAPI');
controller.hears('api (bessel) (sendme|get|exec|monitor) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
//controller.hears('api (bessel) ([a-zA-Z]) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
        var infrastructure = message.match[1];
        var method = message.match [2];
        var api_command = message.match[3];
        api_command=api_command.replace(/"/g,"'");
        const exec = require('child_process').exec;
        var command;
        var filename;
        var api_subcommand;
        var currentUser=name;
        if(method === "sendme"){
            command = '/home/scastro/bot/proxy_wrapper.sh '+currentUser+' '+infrastructure+' '+method+' "'+api_command+'"'
            console.log('COMMAND TO RUN: '+command);
            bot.reply(message,{text: 'Generating Document... please wait...'});
            const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      var extraInfo = "";
                      if (output) {
                        var fs = require('fs');
                        filename=output;
                        if(api_command.indexOf("screenshot") != -1){
                            hostid=filename.substring(filename.indexOf("_")+1,filename.lastIndexOf("_"));
                            extraInfo="Screenshot, HostID = "+hostid;
                        }
                        bot.api.files.upload({
                          token: process.env.token,
                          title: "Document ("+extraInfo+")",
                          filename: output,
                          filetype: "auto",
                          //content: "Posted with files.upload API",
                          file: fs.createReadStream(output),
                          channels: message.channel
                        }, function(err, response) {
                          if (err) {
                            bot.reply(message,{text: 'Error generating document: '+output});
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
            }
            if(method === "get"){
                command = '/home/scastro/bot/proxy_wrapper.sh '+currentUser+' '+infrastructure+' '+method+' "'+api_command+'"'
                console.log('COMMAND TO RUN: '+command);
                bot.reply(message,{text: 'Getting info... please wait...'});
                const child = exec(command,
                      (error, stdout, stderr) => {
                          var output = stdout;
                          if (output) {
                              bot.reply(message, '```'+output+'```');
                          } else {
                              bot.reply(message, ':( Hubo un error al invocar la API');
                          }
                          console.log('stderr: ${stderr}');
                      });
            }
            if(method === "monitor"){
                command = '/home/scastro/bot/create_monitor.sh &'
                console.log('COMMAND TO RUN: '+command);
                bot.reply(message,{text: 'Creating monitor... please wait...'});
                const child = exec(command,
                      (error, stdout, stderr) => {
                          var output = stdout;
                          if (output) {
                              console.log(output);
                          } else {
                              bot.reply(message, ':( Hubo un error al invocar la API');
                          }
                          console.log('stderr: ${stderr}');
                      });
            }
        });
});
