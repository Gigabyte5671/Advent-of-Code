import { readFileSync } from 'fs';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).split("\n");

const thing = { L: 0, R: 1 };
const instructions = input.shift();
input.shift();
input.pop();

const regex = /(?<key>[A-Z]{3}) = \((?<left>[A-Z]{3}), (?<right>[A-Z]{3})\)/;
console.log(regex.exec(input[0]).groups);

const codes = {};

for (const line of input) {
	const { key, left, right } = regex.exec(line).groups;
	codes[key] = [left, right];
}

let steps = 0;
let code = "AAA";
let letterIndex = 0;

while (code !== 'ZZZ') {
	code = codes[code][thing[instructions.charAt(letterIndex)]];
	steps++;
	letterIndex++;
	if(letterIndex >= instructions.length) {
		letterIndex = 0;
	}
}

console.log(steps);
console.log(code);
