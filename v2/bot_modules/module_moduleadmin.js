var debug = require('debug')('mod_moduleadmin');
controller.hears('^bot reloadModule (.*)', ['ambient','direct_message,direct_mention,mention'], function(bot, message) {
    debug("I Heard someone requested a module reload!!!")
    var moduleName=message.match[1].toLowerCase();
    var moduleFileName = bot_path+'/bot_modules/'+'module_'+moduleName+'.js';
    bot.reply(message,'Trying to dinamically reload module: '+moduleName);
    debug("Reload module requested ("+moduleName+")");
    debug("Deleting module from cache...");
    try{
        delete require.cache[require.resolve(moduleFileName)];
    }
    catch (e){
        console.log("Warning: Module was not previously loaded!!!")
    }
    try {
        debug("Trying to reload module file ("+moduleFileName+")");
        require (moduleFileName);
        bot.reply(message,'Module has been reloaded correctly ('+moduleName+')');
    }
    catch (e) {
       bot.reply(message,'Error reloading module ('+moduleName+'). See console log for details');
       console.log(e);
    }
});

controller.hears('^loadModule (.*)', 'ambient', function(bot, message) {
    var moduleName=message.match[1].toLowerCase();
    var moduleFileName = bot_path+'/bot_modules/'+'module_'+moduleName+'.js';
    debug("I Heard someone requested a module load!!!");
    debug("Load module requested ("+moduleName+")");
    bot.reply(message,'Trying to load module: '+moduleName);
    var moduleLoaded=false;
    try{
        debug("Check if module is already loaded ("+moduleName+")");
        delete require.cache[require.resolve(moduleFileName)];
        moduleLoaded=true;
    }
    catch (e){
        bot.reply(message,'Module has been loaded previously ('+moduleName+'). Use reloadModule to reload.');
        console.log("Error: Module was previously loaded!!!");
    }
    if(!moduleLoaded){
         try {
            debug("Trying to load module file ("+moduleFileName+")");
            require (moduleFileName);
            bot.reply(message,'Module loaded correctly ('+moduleName+')');
        }
        catch (e) {
           bot.reply(message,'Error loading module ('+moduleName+'). See console log for details');
           console.log(e);
        }
    }
});

controller.hears('^unloadModule (.*)', 'ambient', function(bot, message) {
    var moduleName=message.match[1].toLowerCase();
    var moduleFileName = bot_path+'/bot_modules/'+'module_'+moduleName+'.js';
    debug("I Heard someone requested a module unload!!!");
    debug("Unload module requested ("+moduleName+")");
    bot.reply(message,'Trying to unload module ('+moduleName+')');
    var moduleUnloaded=false;
    try{
        debug("Trying to unload module ("+moduleName+")");
        delete require.cache[require.resolve(moduleFileName)];
        moduleUnloaded=true;
        bot.reply(message,'Module unloaded correctly ('+moduleName+')');
    }
    catch (e){
        console.log("Error: Module was not previously loaded!!!");
        bot.reply(message,'Error unloading module ('+moduleName+'). See console lof for details'); 
    }
});
