const mongoose = require('mongoose');
const Member = require('../models/Member.js');
const RepTransaction = require('../models/RepTransaction.js');
const Setting = require('../models/Setting.js');

/**
 * Manages transactions for the Reputation System.
 */
class RepBroker {

	/**
	 * Gives set amount of Reputation to user.
	 *
	 * @param {Object} data - Data object for transaction.
	 * @param {Number} data.recipientId - Id of user that will receive rep.
	 * @param {Number} data.giverId - Id of user that is giving rep.
	 * @param {Number} data.amount - Amount of rep to give.
	 * @param {NUmber} data.type - Type of rep award. 0: Default, 1: Special.
	 * @param {String} data.reason - Reason for which rep is being given.
	 */
	static async giveRep(data) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const { giverId, recipientId, amount, reason, type } = data;
			const recipient = await Member.findOrCreate(recipientId);

			recipient.reputation += Number(amount);
			recipient.save();

			const log = new RepTransaction({
				giverId: giverId,
				recipientId: recipientId,
				amount: amount,
				reason: reason,
				type: type,
			});
			log.save();
		}
		catch (error) {
			await session.abortTransaction();
			throw error;
		}
		finally {
			session.endSession();
		}
	}

	/**
	 * Gives the default user award.
	 *
	 * @param {Object} data - Data object for transaction.
	 * @param {Number} data.recipientId - Id of user that will receive rep.
	 * @param {Number} data.giverId - Id of user that is giving rep.
	 */
	static async defaultAward(data) {
		const { giverId, recipientId, isBot } = data;
		const awardSetting = await Setting.findKey('rep_award');
		const { interval, award, kickback, allowBot } = awardSetting.value;

		// Check for self award.
		if (giverId === recipientId) {
			throw new RepError('Não é possível dar bônus para a própria reputação.');
		}

		// Check for bot
		if (!allowBot && isBot) {
			throw new RepError('Não é possível dar bônus de reputação para um bot.');
		}

		const latest = await RepTransaction.latestDefault(giverId);
		if (latest) {

			// Check for time window.
			const timeWindow = getCurrentTimeWindow(interval);
			if (latest.timestamp > timeWindow.start) {
				const formatter = new Intl.DateTimeFormat(
					'pt-BR',
					{
						timeZone: 'America/Sao_Paulo',
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
					},
				);
				const nextTime = formatter.format(timeWindow.end);
				throw new RepError(`Ainda não é possível dar reputação. Tente novamente após ${nextTime}.`);
			}

			// Check for latest recipient.
			if (latest.recipientId === recipientId) {
				throw new RepError('Não é possível dar bônus para o mesmo membro duas vezes seguidas.');
			}
		}

		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			await RepBroker.giveRep({
				giverId: giverId,
				recipientId: recipientId,
				amount: award,
				type: 0,
				reason: 'Default Award',
			});

			await RepBroker.giveRep({
				giverId: 0,
				recipientId: giverId,
				amount: kickback,
				type: 0,
				reason: 'Default Award Kickback',
			});
		}
		catch (error) {
			await session.abortTransaction();
			throw error;
		}
		finally {
			session.endSession();
		}
		return;
	}
}

/**
 * Defines a custom error for the Reputation System.
 */
class RepError extends Error {
	constructor(message) {
		super(message);
		this.name = 'RepError';
	}
}

/**
 * Get start and end times of current
 * time window for default rep award.
 *
 * @param {Number} interval - Time window length in minutes.
 * @return {Object} Time window.
 */
function getCurrentTimeWindow(minutes) {
	// Convert minutes to milliseconds.
	const timeWindow = minutes * 60000;

	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	// Get today at midnight with America/Sao_Paulo timezone.
	const midnight = new Date(`${year}-${month}-${day}T00:00:00-03:00`);

	const windowIndex = Math.floor(
		(now.getTime() - midnight.getTime())
		/ timeWindow,
	);

	const startTime = new Date(
		midnight.getTime()
		+ timeWindow * windowIndex,
	);

	const endTime = new Date(
		midnight.getTime() + timeWindow
		* (windowIndex + 1),
	);

	return { start: startTime, end: endTime };
}

module.exports = { RepBroker, RepError };
