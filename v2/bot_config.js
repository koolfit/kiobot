// enableDebug: Enable or disable debug messages in console
enableDebug = true;
// bot_path: Path of the .js file containing the bot code
bot_path = '/home/ubuntu/';
// token: API token to connect to Slack
token = 'xoxb-239485403634-fjcUDJ18tVnKv5tN0qDW6JVO';
// enableWebServer: Whether or not enable WebServer for listening Interactive Messages events.
enableWebServer = true;
// clientId: ID of client app on slack
clientId = '67389791619.257685196482';
// clientSecret: Secret token of client app on Slack
clientSecret = 'dc33864124d21afa2d751e1c3f35deba';
// botPort: Port in wich to listen events API from Slack.
botPort = '3000';
// useRTM: Enable or disable RTM API (disable if we're going to enable interactiveMessages API to avoid duplicate messages). Valid values are: true or false (without quotes)
useRTM = true;
// useInteractiveReplies: Enable or disable Interactive Replies (interactive messages). Valid values are: true or false (wihtout quotes). If enabled, set useRTM to "false"
useInteractiveReplies = false;
// loadModules: (array) list of modules to load automatically at bot startup
loadModules = ["moduleadmin","hearmiddleware","generaltalk","help","openstackAPI","openstackconvos"];
