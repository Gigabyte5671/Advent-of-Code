import { readFileSync } from 'fs';

const output = readFileSync('input.txt', { encoding: 'utf-8' })
	.split('\n')
	.slice(0, -1)
	.map(line => ({
		index: parseInt(/^Game\s(?<id>[\d]+)/ig.exec(line).groups.id),
		red: [ ...line.matchAll(/(?<red>[\d]+)\sred/ig) ].map(red => parseInt(red[1] ?? 0)).reduce((a, b) => Math.max(a, b), 0),
		green: [ ...line.matchAll(/(?<green>[\d]+)\sgreen/ig) ].map(green => parseInt(green[1] ?? 0)).reduce((a, b) => Math.max(a, b), 0),
		blue: [ ...line.matchAll(/(?<blue>[\d]+)\sblue/ig) ].map(blue => parseInt(blue[1] ?? 0)).reduce((a, b) => Math.max(a, b), 0)
	}))
	.map(a => a.red * a.green * a.blue)
	.reduce((a, b) => a + b);

console.log(output);
