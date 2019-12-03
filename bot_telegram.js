const dotenv = require('dotenv');
const path = require('path');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { db } = require('./db');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const telegramBot = new Telegraf(process.env.BOT_TOKEN);

// enable logging
// telegramBot.use(Telegraf.log());

telegramBot.start(ctx => {
	const connectButton = Markup.callbackButton('Connect Skype', 'CONNECT_SKYPE');
	const disconnectButton = Markup.callbackButton(
		'Disconnect Skype',
		'DISCONNECT_SKYPE'
	);

	const telegramUserRef = db.doc(
		`bot/telegram/users/${ctx.message.from.username}`
	);

	telegramUserRef.get().then(user => {
		return ctx.reply(
			`Привет, ${ctx.from.first_name}! Чем могу быть полезен?`,
			// create keyboard
			Markup.inlineKeyboard([
				user.exists ? disconnectButton : connectButton,
				Markup.callbackButton('Nothing...', 'NOTHING')
			]).extra()
		);
	});
});

telegramBot.action('CONNECT_SKYPE', ctx => {
	const telegramUserRef = db.doc(
		`bot/telegram/users/${ctx.update.callback_query.from.username}`
	);

	telegramUserRef.get().then(user => {
		if (user.exists) return ctx.reply(`You already connected`);
		telegramUserRef.set({
			username: ctx.update.callback_query.from.username,
			chat_id: ctx.update.callback_query.from.id
		});
		return ctx.reply(`You added to database 👍`);
	});
});

telegramBot.action('DISCONNECT_SKYPE', ctx => {
	const telegramUserRef = db.doc(
		`bot/telegram/users/${ctx.update.callback_query.from.username}`
	);
	return ctx.reply(`Disconnected (not really.. it's in development) 🤖`);
});

telegramBot.action('NOTHING', ctx => {
	return ctx.reply('👀');
});

module.exports.telegramBot = telegramBot;
