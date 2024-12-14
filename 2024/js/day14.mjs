import { writeFileSync } from 'node:fs';
import { getPuzzleInput } from './getPuzzleInput.mjs';

const list = (await getPuzzleInput(14, false)).split('\n');
const width = 101;
const height = 103;

class Vector {
	x;
	y;
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Robot {
	position;
	velocity;

	constructor (position, velocity) {
		this.position = position;
		this.velocity = velocity;
	}
}


// Part 1.
function part1 () {
	const duration = 10000;
	const robots = list.map(item => {
		const pattern = /[pv]=(?<x>[\d-]+),(?<y>[\d-]+)/i;
		const position = pattern.exec(item.split(' ')[0])?.groups;
		const velocity = pattern.exec(item.split(' ')[1])?.groups;
		return new Robot(
			new Vector(Number(position.x), Number(position.y)),
			new Vector(Number(velocity.x), Number(velocity.y))
		);
	});
	for (let i = 0; i < duration; i ++) {
		for (const robot of robots) {
			const x = robot.position.x + robot.velocity.x;
			const y = robot.position.y + robot.velocity.y;
			robot.position.x = ((x % width) + width) % width;
			robot.position.y = ((y % height) + height) % height;
		}
	}
	const quadrants = [
		robots.filter(({ position }) => 0 <= position.x && position.x < Math.floor(width / 2) && 0 <= position.y && position.y < Math.floor(height / 2)),
		robots.filter(({ position }) => Math.floor(width / 2) < position.x && position.x < width && 0 <= position.y && position.y < Math.floor(height / 2)),
		robots.filter(({ position }) => Math.floor(width / 2) < position.x && position.x < width && Math.floor(height / 2) < position.y && position.y < height),
		robots.filter(({ position }) => 0 <= position.x && position.x < Math.floor(width / 2) && Math.floor(height / 2) < position.y && position.y < height)
	];
	const safetyFactor = quadrants.reduce((a, b) => a * b.length, 1);
	console.info('Part 1:', safetyFactor);
}
part1();

// Part 2.
function renderPositions (robots) {
	const grid = [];
	for (let r = 0; r < height; r++) {
		grid.push(new Array(width).fill(0));
	}
	for (const robot of robots) {
		if (typeof grid[robot.position.y]?.[robot.position.x] === 'number') {
			grid[robot.position.y][robot.position.x]++;
		}
	}
	return grid;
}

function part2 () {
	const duration = 10000;
	const robots = list.map(item => {
		const pattern = /[pv]=(?<x>[\d-]+),(?<y>[\d-]+)/i;
		const position = pattern.exec(item.split(' ')[0])?.groups;
		const velocity = pattern.exec(item.split(' ')[1])?.groups;
		return new Robot(
			new Vector(Number(position.x), Number(position.y)),
			new Vector(Number(velocity.x), Number(velocity.y))
		);
	});
	let printout = '';
	let seconds = 0;
	for (let i = 0; i < duration; i ++) {
		const p = renderPositions(robots).map(row => row.join('').replaceAll('0', '.')).join('\n');
		printout += i + '\n' + p + '\n';
		if (p.includes('1111111111')) {
			seconds = i;
		}
		for (const robot of robots) {
			const x = robot.position.x + robot.velocity.x;
			const y = robot.position.y + robot.velocity.y;
			robot.position.x = ((x % width) + width) % width;
			robot.position.y = ((y % height) + height) % height;
		}
	}
	writeFileSync('./dump.txt', printout, { encoding: 'utf-8' });
	console.info('Part 2:', seconds);
}
part2();
