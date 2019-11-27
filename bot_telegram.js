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

// telegramBot.command("onetime", ({ reply }) =>
// 	reply(
// 		"One time keyboard",
// 		Markup.keyboard(["/simple", "/inline", "/pyramid"])
// 			.oneTime()
// 			.resize()
// 			.extra()
// 	)
// );

// telegramBot.command("custom", ({ reply }) => {
// 	return reply(
// 		"Custom buttons keyboard",
// 		Markup.keyboard([
// 			["🔍 Search", "😎 Popular"], // Row1 with 2 buttons
// 			["☸ Setting", "📞 Feedback"], // Row2 with 2 buttons
// 			["📢 Ads", "⭐️ Rate us", "👥 Share"] // Row3 with 3 buttons
// 		])
// 			.oneTime()
// 			.resize()
// 			.extra()
// 	);
// });

// telegramBot.hears("🔍 Search", ctx => ctx.reply("Yay!"));
// telegramBot.hears("📢 Ads", ctx => ctx.reply("Free hugs. Call now!"));

// telegramBot.command("special", ctx => {
// 	return ctx.reply(
// 		"Special buttons keyboard",
// 		Extra.markup(markup => {
// 			return markup
// 				.resize()
// 				.keyboard([
// 					markup.contactRequestButton("Send contact"),
// 					markup.locationRequestButton("Send location")
// 				]);
// 		})
// 	);
// });

// telegramBot.command("pyramid", ctx => {
// 	return ctx.reply(
// 		"Keyboard wrap",
// 		Extra.markup(
// 			Markup.keyboard(["one", "two", "three", "four", "five", "six"], {
// 				wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
// 			})
// 		)
// 	);
// });

// telegramBot.command("simple", ctx => {
// 	return ctx.replyWithHTML(
// 		"<b>Coke</b> or <i>Pepsi?</i>",
// 		Extra.markup(Markup.keyboard(["Coke", "Pepsi"]))
// 	);
// });

// telegramBot.command("inline", ctx => {
// 	return ctx.reply(
// 		"<b>Coke</b> or <i>Pepsi?</i>",
// 		Extra.HTML().markup(m =>
// 			m.inlineKeyboard([
// 				m.callbackButton("Coke", "Coke"),
// 				m.callbackButton("Pepsi", "Pepsi")
// 			])
// 		)
// 	);
// });

// telegramBot.command("random", ctx => {
// 	return ctx.reply(
// 		"random example",
// 		Markup.inlineKeyboard([
// 			Markup.callbackButton("Coke", "Coke"),
// 			Markup.callbackButton("Dr Pepper", "Dr Pepper", Math.random() > 0.5),
// 			Markup.callbackButton("Pepsi", "Pepsi")
// 		]).extra()
// 	);
// });

// telegramBot.command("caption", ctx => {
// 	return ctx.replyWithPhoto(
// 		{ url: "https://picsum.photos/200/300/?random" },
// 		Extra.load({ caption: "Caption" })
// 			.markdown()
// 			.markup(m =>
// 				m.inlineKeyboard([
// 					m.callbackButton("Plain", "plain"),
// 					m.callbackButton("Italic", "italic")
// 				])
// 			)
// 	);
// });

// telegramBot.hears(/\/wrap (\d+)/, ctx => {
// 	return ctx.reply(
// 		"Keyboard wrap",
// 		Extra.markup(
// 			Markup.keyboard(["one", "two", "three", "four", "five", "six"], {
// 				columns: parseInt(ctx.match[1])
// 			})
// 		)
// 	);
// });

// telegramBot.action("Dr Pepper", (ctx, next) => {
// 	return ctx.reply("👍").then(() => next());
// });

// telegramBot.action("plain", async ctx => {
// 	await ctx.answerCbQuery();
// 	await ctx.editMessageCaption(
// 		"Caption",
// 		Markup.inlineKeyboard([
// 			Markup.callbackButton("Plain", "plain"),
// 			Markup.callbackButton("Italic", "italic")
// 		])
// 	);
// });

// telegramBot.action("italic", async ctx => {
// 	await ctx.answerCbQuery();
// 	await ctx.editMessageCaption(
// 		"_Caption_",
// 		Extra.markdown().markup(
// 			Markup.inlineKeyboard([
// 				Markup.callbackButton("Plain", "plain"),
// 				Markup.callbackButton("* Italic *", "italic")
// 			])
// 		)
// 	);
// });

// telegramBot.action(/.+/, ctx => {
// 	return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`);
// });

module.exports.telegramBot = telegramBot;
