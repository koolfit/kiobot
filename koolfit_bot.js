
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token

}).startRTM();

/* Function to hear EXACT word */
/*
 * https://github.com/howdyai/botkit/blob/master/readme.md
 *
 */

// this example does a simple string match instead of using regular expressions
function custom_hear_middleware(patterns, message) {

    for (var p = 0; p < patterns.length; p++) {
        if (patterns[p] == message.text) {
            return true;
        }
    }
    return false;
}

const adj1 = ["artless","bawdy","beslubbering","bootless","churlish","cockered","clouted","craven","currish","dankish","dissembling","droning","errant","fawning","fobbing","froward","frothy","gleeking","goatish","gorbellied","impertinent","infectious","jarring","loggerheaded","lumpish","mammering","mangled","mewling","paunchy","pribbling","puking","puny","qualling","rank","reeky","roguish","ruttish","saucy","spleeny","spongy","surly","tottering","unmuzzled","vain","venomed","villainous","warped","wayward","weedy","yeasty","cullionly","fusty","caluminous","wimpled","burly-boned","misbegotten","odiferous","poisonous","fishified","Wart-necked"];

const adj2 = ["base-court","bat-fowling","beef-witted","beetle-headed","boil-brained","clapper-clawed","clay-brained","common-kissing","crook-pated","dismal-dreaming","dizzy-eyed","doghearted","dread-bolted","earth-vexing","elf-skinned","fat-kidneyed","fen-sucked","flap-mouthed","fly-bitten","folly-fallen","fool-born","full-gorged","guts-griping","half-faced","hasty-witted","hedge-born","hell-hated","idle-headed","ill-breeding","ill-nurtured","knotty-pated","milk-livered","motley-minded","onion-eyed","plume-plucked","pottle-deep","pox-marked","reeling-ripe","rough-hewn","rude-growing","rump-fed","shard-borne","sheep-biting","spur-galled","swag-bellied","tardy-gaited","tickle-brained","toad-spotted","unchin-snouted","weather-bitten","whoreson","malmsey-nosed","rampallian","lily-livered","scurvy-valiant","brazen-faced","unwash'd","leaden-footed","muddy-mettled","pigeon-liver'd","scale-sided","bunch-back'd"];

const noun = ["apple-john","baggage","barnacle","bladder","boar-pig","bugbear","bum-bailey","canker-blossom","clack-dish","clotpole","coxcomb","codpiece","death-token","dewberry","flap-dragon","flax-wench","flirt-gill","foot-licker","fustilarian","giglet","gudgeon","haggard","harpy","hedge-pig","horn-beast","hugger-mugger","joithead","lewdster","lout","maggot-pie","malt-worm","mammet","measle","minnow","miscreant","moldwarp","mumble-news","nut-hook","pigeon-egg","pignut","puttock","pumpion","ratsbane","scut","skainsmate","strumpet","varlot","vassal","whey-face","wagtail","knave","blind-worm","popinjay","scullian","jolt-head","malcontent","devil-monk","toad","rascal","Basket-Cockle"];

var Crypto = require('crypto');

Array.prototype.sample = function() {
  var buf = Crypto.randomBytes(2);
  var index = buf.readUInt16BE(0) % this.length;
  return this[index];
}

function insult() {
    var insulter = {
        generateInsult: function() {
            var a1 = adj1.sample();
            var article = "a";
            if ("aeiouh".indexOf(a1[0]) !== -1) {
                article = "an";
            }
            return(
                "thou art " + article + " " + a1 + " " + adj2.sample() + " " + noun.sample() + "!"
            );
        }
    }
    return insulter;
};

controller.hears(['insult (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    var insulter = new insult();
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
		var  m = '@'+name+' '+insulter.generateInsult()+'\n';

        bot.reply(message, m);
    });
});


/************    Ceph Fenix ************/

var fenixPrivateIP="10.62.98.20";
var fenixPublicIP="201.175.27.20";
var fenixIP=fenixPrivateIP;

controller.hears(['fenix ceph'], 'direct_message,direct_mention', custom_hear_middleware, function(bot, message) {
    const exec = require('child_process').exec;
    const child = exec('ssh kftadmin@'+fenixIP+' -p65535 "sudo ceph -s"',
                  (error, stdout, stderr) => {
                      var ceph_output = stdout;
                      bot.reply(message, '```'+ceph_output+'```');
                      console.log('stderr: ${stderr}');
                  });
    ceph_output = "";

});

/************    Ceph New Cluster Fenix ************/

controller.hears(['fenix cephkpp'], 'direct_message,direct_mention', custom_hear_middleware, function(bot, message) {
    const exec = require('child_process').exec;
    const child = exec('ssh kftadmin@'+fenixIP+' -p65535 "sudo ceph -c /etc/ceph/cephkpp.conf --cluster cephkpp -s"',
                  (error, stdout, stderr) => {
                      var ceph_output = stdout;
                      bot.reply(message, '```'+ceph_output+'```');
                      console.log('stderr: ${stderr}');
                  });
    ceph_output = "";

});

/*
function func_novnc() {
    source /root/admin-openrc.sh
    nova get-vnc-console $1 novnc | grep novnc | cut -d\| -f3
}

alias novnc=func_novnc
*/


controller.hears('fenix novnc (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    var name_instance = message.match[1];

    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic novnc '+name_instance+' 2>/dev/null"'; 
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      bot.reply(message, '```'+output+'```');
                      console.log('stderr: ${stderr}');
                  });
});

/*
function func_getnamebyip() {
    source /root/admin-openrc.sh
    nova list --all-tenants | grep "\<${0}\>" | cut -d\| -f3
}

alias getNamebyIP=func_getnamebyip
*/

controller.hears('fenix get name (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic getNamebyIP '+ip_instance+' 2>/dev/null"';
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

/*
function func_getid() {
    source /root/admin-openrc.sh
    nova list --all-tenants | grep "\<${0}\>" | cut -d\| -f2
}

alias getIDbyIP=func_getidbyip
*/

controller.hears('fenix get id (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic getIDbyIP '+ip_instance+' 2>/dev/null"';
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

/*
 function func_nova_service_list() {
    source /root/admin-openrc.sh
    nova service-list
}

alias nova_service_list=func_nova_service_list
*/

controller.hears('fenix nova service-list', 'direct_message,direct_mention,mention', function(bot, message) {
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic nova_service_list 2>/dev/null"';
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

/* Infrastructure Capacity */

controller.hears('fenix infracapacity', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Generando correo con información ... espera');
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic /root/infrastructureCapacity.sh 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, 'Correo enviado.');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});	

/* Protocolo de incidencias Jordan */

controller.hears(['jordan graficas', 'jordan gráficas'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Generando gráficas ... espera');
    const exec = require('child_process').exec;
    //var command = "ssh kftadmin@10.52.30.10 -p65535 \"/usr/local/bin/generate_zabbix_graphs_day.sh\" 2>/dev/null";
    var command = "ssh kftadmin@201.175.22.16 -p65535 \"/usr/local/bin/wrapper_jordan_graphs.sh\" 2>/dev/null";
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

/***********  HELP ***********/
controller.hears('help', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
		var help = 'Hola @'+name+' , estos son los comandos que puedo recibir:\n';
        help += 'Actualmente sólo estoy trabajando con la infraestructura de *Tribunal Superior de Justicia* (fenix)\n\n\n';
        help += '*Ya puedo generar las gráficas del protocolo de incidencias de GOB.MX!*\n\n\n';
    	help += '*Obtener URL de novnc*: `<infraestructura> novnc <nombre instancia>`\n';
    	help += 'ejemplo: `fenix novnc TEST_KPP`\n\n\n';
        help += '*Obtener el estatus de Ceph*: `<infraestructura> ceph`\n';
    	help += 'Para Tribunal también hay un `fenix cephkpp` (Cluster 2 de Ceph)\n\n\n';
        help += '*Obtener el nombre de la instancia a partir de la IP*: `<infraestructura> get name <IP>`\n';
        help += 'ejemplo: `fenix get name 10.10.21.36`\n\n\n';
        help += '*nova service-list*: `<infraestructura> nova service-list`\n\n\n';
        help += '*Obtener el ID de la instancia a partir de la IP*: `<infraestructura> get id <IP>`\n';
        help += 'ejemplo: `fenix get id 10.10.21.36`\n\n\n';
        help += '*Obtener gráficas del protocolo de incidencias:* `jordan gráficas`\n\n\n';
        help += '*Generar reporte de capacidad de infraestructura:* `<infraestructura> infracapacity`\n\n\n';
		bot.reply(message, help);
	})
});

controller.hears(['Hola','hola'], 'ambient', function(bot, message) {
    var hi_messages = ['hola',
                       'buen día',
                       'cómo estás?',
                       'que onda',
                       'Hola'];
    var randMessage = hi_messages[Math.floor(Math.random() * hi_messages.length)];
    bot.reply(message, randMessage);
});

/*
controller.hears(['Ceph','ceph', 'chep', 'Chep'], 'ambient', function(bot, message) {
    var ceph_messages = ['está degradado?', 
                         'por qué siguen usando Ceph?', 
                         'si quieren nos cooperamos para un storage como el de Azure', 
                         'ay no',
                         'está rebalanceando?',
                         'te puedo ayudar a obtener información, tengo comandos'];
    var randMessage = ceph_messages[Math.floor(Math.random() * ceph_messages.length)];
    bot.reply(message, randMessage);
});


controller.hears(['Max','max', 'Maximiliano'], 'ambient', function(bot, message) {
    var ceph_messages = ['Yo no soy Max', 
                         'Dejen de decir que yo soy Max', 
                         'Yo le ayudaba a Max, no él a mi', 
                         'Yo soy un bot, no un Max'];
    var randMessage = ceph_messages[Math.floor(Math.random() * ceph_messages.length)];
    bot.reply(message, randMessage);
});
*/

controller.hears(['hay alguien?', ':rodadora:'], 'ambient', function(bot, message) {
    bot.reply(message,{
      username: "kiobot",
      text: " ",
      icon_emoji: ":rodadora:",
   });
});

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


