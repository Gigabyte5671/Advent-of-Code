import { readFileSync } from 'fs';

const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function matchWithOverlap(input, regexp) {
    let result = [], match;
    while (match = regexp.exec(input)) {
        regexp.lastIndex -= match[0].length - 1;
        result.push(match[0]);
    }
    return result;
}

function parseNumber (value) {
	const index = numbers.indexOf(value);
	return index >= 0 ? index : value;
}

const output = readFileSync('input.txt', { encoding: 'utf-8' })
	.split('\n')
	.slice(0, -1)
	.map(line => matchWithOverlap(line, new RegExp(`(?:\\d|${numbers.join('|')})`, 'ig')))
	.map(line => parseInt(`${parseNumber(line.at(0))}${parseNumber(line.at(-1))}`))
	.reduce((a, b) => a + b);

console.log(output);
