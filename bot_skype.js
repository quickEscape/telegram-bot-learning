const dotenv = require('dotenv');
const path = require('path');

const { ActivityHandler } = require('botbuilder');
const Telegram = require('telegraf/telegram');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const telegram = new Telegram(process.env.BOT_TOKEN);

class EchoBot extends ActivityHandler {
	constructor() {
		super();
		// See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
		this.onMessage(async (context, next) => {
			await context.sendActivity(`You said '${context.activity.text}'`);

			// send message to telegram
			await telegram.sendMessage(371378202, context.activity.text);

			// By calling next() you ensure that the next BotHandler is run.
			await next();
		});
	}
}

module.exports.EchoBot = EchoBot;
