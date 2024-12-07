import { getPuzzleInput } from './getPuzzleInput.mjs';

const maze = (await getPuzzleInput(6)).split('\n').map(row => row.split(''));
maze.pop();
const width = maze[0].length;
const height = maze.length;

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
	move (direction) {
		this.x += direction.x;
		this.y += direction.y;
	}
	toString () {
		return `${this.x}:${this.y}`;
	}
}
const directions = [
	new Vector(0, -1),
	new Vector(1, 0),
	new Vector(0, 1),
	new Vector(-1, 0)
];
function getGuard (maze) {
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			const character = maze[r][c];
			if (character === '^') {
				return new Vector(c, r);
			}
		}
	}
}
function rotate (direction) {
	direction++;
	if (direction > 3) direction = 0;
	return direction;
}
function willCollide (position, direction, maze) {
	return maze[position.y + direction.y]?.[position.x + direction.x] === '#';
}

let direction = 0;
const position = getGuard(maze);
const points = new Map();
while (position.isInBounds()) {
	points.set(position.toString(), position.clone());
	if (willCollide(position, directions[direction], maze)) {
		direction = rotate(direction);
	}
	position.move(directions[direction]);
}
console.info('Part 1:', points.size);

// Part 2.
let loops = 0;
const max = 10000;
const path = [...points.values()];
const start = getGuard(maze);
for (let i = 0; i < path.length; i++) {
	const point = path[i];
	process.stdout.write(`Progress: ${((i + 1) / path.length * 100).toFixed(2)}% ${i}i ${point.x}x ${point.y}y       \r`);
	if (maze[point.y][point.x] === '^' || maze[point.y][point.x] === '#') {
		continue;
	}
	maze[point.y][point.x] = '#';
	const position = start.clone();
	let direction = 0;
	let visited = 1;
	do {
		while (willCollide(position, directions[direction], maze)) {
			direction = rotate(direction);
		}
		position.move(directions[direction]);
		visited++;
		if (visited > max) break;
	} while (position.isInBounds());
	if (visited > max) {
		loops++;
	}
	maze[point.y][point.x] = '.';
}
console.info('\nPart 2:', loops);
