import { getPuzzleInput } from './getPuzzleInput.mjs';

const map = (await getPuzzleInput(10)).split('\n').map(row => row.split('').map(Number));
const width = map[0].length;
const height = map.length;

class Vector {
	x;
	y;
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	clone () {
		return new Vector(this.x, this.y);
	}
	isEqual (vector) {
		return this.x === vector.x && this.y === vector.y;
	}
	isInBounds () {
		const x = 0 <= this.x && this.x <= width - 1;
		const y = 0 <= this.y && this.y <= height - 1;
		return x && y;
	}
	toString () {
		return `${this.x}:${this.y}`;
	}
}

function getTrailheads (map) {
	const trailheads = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			const point = map[r][c];
			if (point === 0) {
				trailheads.push(new Vector(c, r));
			}
		}
	}
	return trailheads;
}

function search (point, previousHeight, trailendsVisited) {
	if (!point.isInBounds()) return 0;
	const height = map[point.y]?.[point.x];
	if (height !== previousHeight + 1) return 0;
	if (height === 9) {
		trailendsVisited?.set(point.toString(), point);
		return 1;
	}
	const directions = [
		new Vector(point.x, point.y - 1),
		new Vector(point.x + 1, point.y),
		new Vector(point.x, point.y + 1),
		new Vector(point.x - 1, point.y)
	];
	let sum = 0;
	for (const direction of directions) {
		sum += search(direction, height, trailendsVisited);
	}
	return sum;
}

// Part 1.
function part1 () {
	const trailheads = getTrailheads(map);
	let total = 0;
	for (const trailhead of trailheads) {
		const trailendsVisited = new Map();
		search(trailhead, -1, trailendsVisited);
		total += trailendsVisited.size;
	}
	console.log('Part 1:', total);
}
part1();

// Part 2.
function part2 () {
	const trailheads = getTrailheads(map);
	let total = 0;
	for (const trailhead of trailheads) {
		total += search(trailhead, -1);
	}
	console.log('Part 2:', total);
}
part2();
