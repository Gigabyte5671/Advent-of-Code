import { getPuzzleInput } from './getPuzzleInput.mjs';

const originalStones = (await getPuzzleInput(11)).split(' ').map(Number);

function split (stone) {
	const digits = stone.toString();
	const half = Math.floor(digits.length / 2);
	const firstHalf = Number(digits.substring(0, half));
	const secondHalf = Number(digits.substring(half));
	return [firstHalf, secondHalf];
}

function change (stones) {
	const newStones = [];
	for (let i = 0; i < stones.length; i++) {
		const stone = stones[i];
		if (stone === 0) {
			newStones.push(1);
		} else if (stone.toString().length % 2 === 0) {
			newStones.push(...split(stone));
		} else {
			newStones.push(stone * 2024);
		}
	}
	return newStones;
}

// Part 1.
function part1 () {
	const blinks = 25;
	let stones = originalStones;
	for (let b = 0; b < blinks; b++) {
		stones = change(stones);
	}
	console.info('Part 1:', stones.length);
}
part1();

// Part 2.
function part2 () {
	const blinks = 75;
	let stones = originalStones;
	let map = new Map();
	for (const stone of stones) {
		map.set(stone, 1);
	}
	for (let b = 0; b < blinks; b++) {
		const newMap = new Map();
		for (const entry of map.entries()) {
			const count = entry[1] ?? 1;
			const stone = entry[0];
			const changed = change([stone]);
			for (const changedStone of changed) {
				newMap.set(changedStone, (newMap.get(changedStone) ?? 0) + count);
			}
		}
		map = newMap;
	}
	const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
	console.info('Part 2:', total);
}
part2();
