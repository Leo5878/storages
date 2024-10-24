import { session } from "grammy";
import { test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { RedisAdapter } from "../../src/mod.ts";
import { RedisMock } from "../redisMock.ts";
import { createBot, createMessage } from "@grammyjs/storage-utils";

test("Pizza counter tests", async () => {
	const bot = createBot();

	bot.use(session({
		initial: () => ({ pizzaCount: 0 }),
		storage: new RedisAdapter({ instance: new RedisMock() }),
	}));

	bot.hears("first", (ctx) => {
		expect(ctx.session.pizzaCount).toEqual(0);
		ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
	});

	bot.hears("second", (ctx) => {
		expect(ctx.session.pizzaCount).toEqual(1);
	});

	await bot.handleUpdate(createMessage(bot, "first").update);
	await bot.handleUpdate(createMessage(bot, "second").update);
});

test("Simple string tests", async () => {
	const bot = createBot(false);

	bot.use(session({
		initial: () => "test",
		storage: new RedisAdapter({ instance: new RedisMock() as any }),
	}));

	bot.hears("first", async (ctx) => {
		ctx.session = `${ctx.session} edited`;
	});

	bot.hears("second", async (ctx) => {
		expect(ctx.session).toEqual("test edited");
	});

	await bot.handleUpdate(createMessage(bot, "first").update);
	await bot.handleUpdate(createMessage(bot, "second").update);
});