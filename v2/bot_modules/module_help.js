var debug = require('debug')('mod_help');
controller.hears('help', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
                bot.reply(message, help);
        })
});
