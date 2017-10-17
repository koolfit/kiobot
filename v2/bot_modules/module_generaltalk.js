var debug = require('debug')('mod_generaltalk');
controller.hears(['^hola'], ['ambient','direct_message,direct_mention,mention'], function(bot, message) {
    var hi_messages = ['hola',
                       'buen día',
                       'cómo estás?',
                       'que onda',
                       'Hola'];
    var randMessage = hi_messages[Math.floor(Math.random() * hi_messages.length)];
    bot.reply(message, randMessage);
});
