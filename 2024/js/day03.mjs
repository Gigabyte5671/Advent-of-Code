import { getPuzzleInput } from './getPuzzleInput.mjs';

const memory = (await getPuzzleInput(3)).replace(/[\r\n]/g, ' ');
const pattern = /mul\((?<base>[\d]+),(?<factor>[\d]+)\)/g;

// Part 1.
let matches = memory.matchAll(pattern);
let total = 0;
for (const match of matches) {
	total += match.groups.base * match.groups.factor;
}
console.info('Part 1:', total);

// Part 2.
const conditionals = /(do\(\)|don't\(\))/g;
const instructions = memory.split(conditionals);
instructions.unshift('do()');
let previousConditional = 'do()';
const enabledInstructions = instructions.filter(thing => {
	if (conditionals.test(thing)) {
		previousConditional = thing;
		return false;
	}
	if (previousConditional === "don't()") return false;
	return true;
}).join('');
matches = enabledInstructions.matchAll(pattern);
total = 0;
for (const match of matches) {
	total += match.groups.base * match.groups.factor;
}
console.info('Part 2:', total);
