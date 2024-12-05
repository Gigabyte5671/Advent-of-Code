import { getPuzzleInput } from './getPuzzleInput.mjs';

const input = (await getPuzzleInput(5)).split('\n\n');
const rules = input[0].split('\n').map(rule => rule.split('|').map(Number));
const updates = input[1].split('\n').map(update => update.split(',').map(Number));
updates.pop();

// Part 1.
function getRules (page) {
	return rules.filter(rule => rule[0] === page || rule[1] === page);
}
function validate (update, page) {
	const index = update.indexOf(page);
	const rules = getRules(page);
	for (const rule of rules) {
		if (!update.includes(rule[0]) || !update.includes(rule[1])) {
			continue;
		}
		const after = Boolean(rule.indexOf(page));
		const opponent = after ? rule[0] : rule[1];
		if (after && update.indexOf(opponent) > index) {
			return false;
		}
		if (!after && update.indexOf(opponent) < index) {
			return false;
		}
	}
	return true;
}
const validUpdates = [];
let total = 0;
for (const update of updates) {
	const valid = [];
	for (const page of update) {
		valid.push(validate(update, page));
	}
	if (!valid.includes(false)) {
		validUpdates.push(update);
		total += update[Math.floor(update.length / 2)];
	}
}
console.info('Part 1:', total);

// Part 2.
function sort (update) {
	const rules = update
		.map(page => getRules(page))
		.flat()
		.filter(rule => update.includes(rule[0]) && update.includes(rule[1]));
	return update.sort((a, b) => {
		const rule = rules.find(rule => rule.includes(a) && rule.includes(b));
		const after = Boolean(rule.indexOf(a));
		return after ? 1 : -1;
	});
}
const invalidUpdates = [];
total = 0;
for (const update of updates) {
	const valid = [];
	for (const page of update) {
		valid.push(validate(update, page));
	}
	if (valid.includes(false)) {
		invalidUpdates.push(update);
	}
}
for (const update of invalidUpdates) {
	const sorted = sort(update);
	total += sorted[Math.floor(sorted.length / 2)];
}
console.info('Part 2:', total);
