import { readFileSync } from 'fs';

const output = readFileSync('input.txt', { encoding: 'utf-8' })
	.split('\n')
	.slice(0, -1)
	.map(line => [ ...line.matchAll(/\d/ig) ])
	.map(line => parseInt(`${line.at(0)}${line.at(-1)}`))
	.reduce((a, b) => a + b);

console.log(output);
