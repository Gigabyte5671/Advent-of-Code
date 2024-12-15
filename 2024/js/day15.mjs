import { getPuzzleInput } from './getPuzzleInput.mjs';

const input = (await getPuzzleInput(15, false)).split('\n\n');
const map = input[0].split('\n').map(row => row.split(''));
const moves = input[1].trim().replaceAll('\n', '');

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
	move (direction) {
		this.x += direction.x;
		this.y += direction.y;
		return this;
	}
}

const directions = {
	'^': new Vector(0, -1),
	'>': new Vector(1, 0),
	'v': new Vector(0, 1),
	'<': new Vector(-1, 0)
};

function delay (time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function getBoxes (map) {
	const width = map[0].length;
	const height = map.length;
	const boxes = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (map[r][c] === 'O' || map[r][c] === '[') {
				boxes.push(new Vector(c, r));
			}
		}
	}
	return boxes;
}

function getRobot (map) {
	const width = map[0].length;
	const height = map.length;
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (map[r][c] === '@') {
				return new Vector(c, r);
			}
		}
	}
}

function getWalls (map) {
	const width = map[0].length;
	const height = map.length;
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
	const movedBoxes = contiguousBoxes.map(box => box.clone().move(direction));
	if (movedBoxes.some(box => map[box.y]?.[box.x] === '#')) return true;
	contiguousBoxes.forEach(box => box.move(direction));
	return false;
}

function willCollide (map, position, direction) {
	return map[position.y + direction.y]?.[position.x + direction.x] === '#';
}

function logMap (map, walls, boxes, robot, move) {
	console.log(move);
	const isWide = map.some(row => row.some(c => c === '['));
	const width = map[0].length;
	const height = map.length;
	const loggableMap = new Array(height);
	for (let r = 0; r < height; r++) {
		loggableMap[r] = new Array(width).fill('.');
	}
	for (const wall of walls) {
		if (loggableMap[wall.y]?.[wall.x]) {
			loggableMap[wall.y][wall.x] = '#';
		}
	}
	for (const box of boxes) {
		if (loggableMap[box.y]?.[box.x]) {
			if (isWide) {
				loggableMap[box.y][box.x] = '[';
				loggableMap[box.y][box.x + 1] = ']';
			} else {
				loggableMap[box.y][box.x] = 'O';
			}
		}
	}
	if (loggableMap[robot.y]?.[robot.x]) {
		loggableMap[robot.y][robot.x] = move;
	}
	for (const row of loggableMap) {
		console.log(row.join(''));
	}
	console.log('');
}

// Part 1.
async function part1 (watch = false) {
	const boxes = getBoxes(map);
	const robot = getRobot(map);
	const walls = getWalls(map);
	if (watch) logMap(map, walls, boxes, robot, 'S');
	for (const move of moves) {
		if (watch) await delay(150);
		const direction = directions[move];
		if (willCollide(map, robot, direction)) {
			if (watch) logMap(map, walls, boxes, robot, move);
			continue;
		}
		const blocked = pushBoxes(map, boxes, robot, direction);
		if (blocked) {
			if (watch) logMap(map, walls, boxes, robot, move);
			continue;
		}
		robot.move(direction);
		if (watch) logMap(map, walls, boxes, robot, move);
	}
	const sum = boxes.reduce((a, b) => a + (b.x + b.y * 100), 0);
	console.info('Part 1:', sum);
}
part1();

// Part 2.
function getContiguousBoxes2 (boxes, position, direction) {
	const contiguous = [];
	const pointer = position.clone();
	const left = direction === directions['<'];
	const right = direction === directions['>'];
	if (left || right) {
		const initialStride = left ? 2 : 1;
		const stride = 2;
		for (let s = 0; s < initialStride; s++) pointer.move(direction);
		let box = boxes.find(box => box.isEqual(pointer));
		while (box) {
			contiguous.push(box);
			for (let s = 0; s < stride; s++) pointer.move(direction);
			box = boxes.find(box => box.isEqual(pointer));
		}
	} else {
		pointer.move(direction);
		let box = boxes.find(box => box.isEqual(pointer) || box.clone().move(directions['>']).isEqual(pointer));
		if (box) {
			contiguous.push(box);
			const more = [
				getContiguousBoxes2(boxes, box.clone(), direction),
				getContiguousBoxes2(boxes, box.clone().move(directions['>']), direction)
			].flat(1);
			contiguous.push(...more);
		}
	}
	return contiguous;
}

function pushBoxes2 (map, boxes, position, direction) {
	const contiguousBoxes = getContiguousBoxes2(boxes, position, direction);
	let uniqueBoxes = new Set();
	for (const box of contiguousBoxes) uniqueBoxes.add(box);
	uniqueBoxes = Array.from(uniqueBoxes);
	if (!uniqueBoxes.length) return false;
	const movedBoxes = uniqueBoxes.map(box => box.clone().move(direction));
	if (movedBoxes.some(box => map[box.y]?.[box.x] === '#' || map[box.y]?.[box.x + 1] === '#')) return true;
	uniqueBoxes.forEach(box => box.move(direction));
	return false;
}

async function part2 (watch = false) {
	const wideMap = map.map(row => row.flatMap(c => {
		const characters = {
			'#': '##',
			'O': '[]',
			'.': '..',
			'@': '@.',
		};
		return characters[c].split('');
	}));
	const boxes = getBoxes(wideMap);
	const robot = getRobot(wideMap);
	const walls = getWalls(wideMap);
	if (watch) logMap(wideMap, walls, boxes, robot, 'S');
	for (const move of moves) {
		if (watch) await delay(150);
		const direction = directions[move];
		if (willCollide(wideMap, robot, direction)) {
			if (watch) logMap(wideMap, walls, boxes, robot, move);
			continue;
		}
		const blocked = pushBoxes2(wideMap, boxes, robot, direction);
		if (blocked) {
			if (watch) logMap(wideMap, walls, boxes, robot, move);
			continue;
		}
		robot.move(direction);
		if (watch) logMap(wideMap, walls, boxes, robot, move);
	}
	const sum = boxes.reduce((a, b) => a + (b.x + b.y * 100), 0);
	console.info('Part 2:', sum);
}
part2();
