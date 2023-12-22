import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).split('\n');
input.pop();

const a = input.map(row => row.indexOf('S'));
const start = {
	x: a.find(value => value > -1),
	y: a.findIndex(value => value > -1)
};
console.log('start:', start);

const directions = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 }
];

const moves = {
	'|': { x1: 0, y1: -1, x2: 0, y2: 1 },
	'-': { x1: -1, y1: 0, x2: 1, y2: 0 },
	'L': { x1: 0, y1: -1, x2: 1, y2: 0 },
	'J': { x1: 0, y1: -1, x2: -1, y2: 0 },
	'7': { x1: -1, y1: 0, x2: 0, y2: 1 },
	'F': { x1: 1, y1: 0, x2: 0, y2: 1 }
};

const previous = {
	x: start.x,
	y: start.y,
	char: 'S'
};

const location = {
	x: start.x,
	y: start.y,
	char: 'S'
};

let length = 1;
let i = 0;

do {
	// Find the next pipe segment.
	for (const direction of directions) {
		const x = location.x + direction.x;
		const y = location.y + direction.y;
		if (x === previous.x && y === previous.y) continue;
		const char = input[y]?.[x];
		if (!char) continue;
		if (char === 'S') location.char = 'S';
		const move = moves[char];
		if (!move) continue;
		if (
			(x + move.x1 === location.x && y + move.y1 === location.y)
			|| (x + move.x2 === location.x && y + move.y2 === location.y)
		) {
			const thing = moves[location.char];
			if (
				thing &&
				(x !== location.x + thing.x1 || y !== location.y + thing.y1)
				&& (x !== location.x + thing.x2 || y !== location.y + thing.y2)
			) continue;
			// Update the previous location.
			previous.x = location.x;
			previous.y = location.y;
			previous.char = location.char;
			location.x += direction.x;
			location.y += direction.y;
			location.char = char;
			length++;
			break;
		}
	}
	i++;
} while (location.char !== 'S');

console.log(length / 2);
