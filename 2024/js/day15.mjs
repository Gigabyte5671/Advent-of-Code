import { getPuzzleInput } from './getPuzzleInput.mjs';

const input = (await getPuzzleInput(15, false)).split('\n\n');
const map = input[0].split('\n').map(row => row.split(''));
const moves = input[1].trim().replaceAll('\n', '');
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
		const x = 1 <= this.x && this.x <= width - 2;
		const y = 1 <= this.y && this.y <= height - 2;
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

const directions = {
	'^': new Vector(0, -1),
	'>': new Vector(1, 0),
	'v': new Vector(0, 1),
	'<': new Vector(-1, 0)
};

function getBoxes (map) {
	const boxes = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (map[r][c] === 'O') {
				boxes.push(new Vector(c, r));
			}
		}
	}
	return boxes;
}

function getRobot (map) {
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (map[r][c] === '@') {
				return new Vector(c, r);
			}
		}
	}
}

function getWalls (map) {
	const walls = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (map[r][c] === '#') {
				walls.push(new Vector(c, r));
			}
		}
	}
	return walls;
}

function getContiguousBoxes (boxes, position, direction) {
	const contiguous = [];
	const pointer = position.clone();
	pointer.move(direction);
	let box = boxes.find(box => box.isEqual(pointer));
	while (box) {
		contiguous.push(box);
		pointer.move(direction);
		box = boxes.find(box => box.isEqual(pointer));
	}
	return contiguous;
}

function pushBoxes (map, boxes, position, direction) {
	const contiguousBoxes = getContiguousBoxes(boxes, position, direction);
	if (!contiguousBoxes.length) return false;
	const movedBoxes = contiguousBoxes.map(box => box.clone());
	movedBoxes.forEach(box => box.move(direction));
	if (movedBoxes.some(box => map[box.y]?.[box.x] === '#')) return true;
	contiguousBoxes.forEach(box => box.move(direction));
	return false;
}

function willCollide (map, position, direction) {
	return map[position.y + direction.y]?.[position.x + direction.x] === '#';
}

function logMap (walls, boxes, robot, move) {
	console.log(move);
	const map = new Array(height);
	for (let r = 0; r < height; r++) {
		map[r] = new Array(width).fill('.');
	}
	for (const wall of walls) {
		if (map[wall.y]?.[wall.x]) {
			map[wall.y][wall.x] = '#';
		}
	}
	for (const box of boxes) {
		if (map[box.y]?.[box.x]) {
			map[box.y][box.x] = 'O';
		}
	}
	if (map[robot.y]?.[robot.x]) {
		map[robot.y][robot.x] = '@';
	}
	for (const row of map) {
		console.log(row.join(''));
	}
	console.log('');
}

// Part 1.
function part1 () {
	const boxes = getBoxes(map);
	const robot = getRobot(map);
	const walls = getWalls(map);
	for (const move of moves) {
		logMap(walls, boxes, robot, move);
		const direction = directions[move];
		if (willCollide(map, robot, direction)) continue;
		const blocked = pushBoxes(map, boxes, robot, direction);
		if (blocked) continue;
		robot.move(direction);
	}
	const sum = boxes.reduce((a, b) => a + (b.x + b.y * 100), 0);
	console.info('Part 1:', sum);
}
part1();
