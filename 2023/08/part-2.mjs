import { readFileSync } from 'fs';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).split("\n");

const letterMap = { L: 0, R: 1 };
const instructions = input.shift();
input.shift();
input.pop();

const regex = /(?<key>[A-Z]{3}) = \((?<left>[A-Z]{3}), (?<right>[A-Z]{3})\)/;
const codes = {};

let paths = [];
for (const line of input) {
	const { key, left, right } = regex.exec(line).groups;
	codes[key] = [left, right];

	if(key.charAt(2) === 'A'){
		paths.push(key);
	}
}

let steps = [];
let letterIndex = 0;

for(let i = 0; i < paths.length; i++){
	steps[i] = 0;
	letterIndex = 0;
	while(paths[i].charAt(2) !== 'Z'){
		paths[i] = codes[paths[i]][letterMap[instructions.charAt(letterIndex)]];

		steps[i] += 1;
		letterIndex++;
		if(letterIndex >= instructions.length) {
			letterIndex = 0;
		}
	}
}

console.log(steps);
console.log(paths);
