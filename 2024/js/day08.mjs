import { getPuzzleInput } from './getPuzzleInput.mjs';

const map = (await getPuzzleInput(8)).split('\n').map(row => row.split(''));
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

// Part 1.
const frequencies = new Map();
for (let r = 0; r < height; r++) {
	for (let c = 0; c < width; c++) {
		const character = map[r][c];
		if (character === '.') continue;
		const towers = frequencies.get(character) ?? [];
		towers.push(new Vector(c, r));
		frequencies.set(character, towers);
	}
}
const antinodes = [];
for (const [frequency, towers] of frequencies.entries()) {
	const visited = [];
	for (const towerA of towers) {
		visited.push(towerA);
		for (const towerB of towers) {
			if (towerA === towerB) continue;
			if (visited.includes(towerB)) continue;
			const dx = towerA.x - towerB.x;
			const dy = towerA.y - towerB.y;
			const maxX = Math.max(towerA.x, towerB.x);
			const minX = Math.min(towerA.x, towerB.x);
			// const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			const gradient = dy / dx;
			// y = mx + c
			// c = y - mx
			const c = towerA.y - gradient * towerA.x;
			const xA = maxX + Math.abs(dx);
			const xB = minX - Math.abs(dx);
			const antinodeA = new Vector(Math.round(xA), Math.round(gradient * xA + c));
			const antinodeB = new Vector(Math.round(xB), Math.round(gradient * xB + c));
			if (!antinodes.some(antinode => antinode.isEqual(antinodeA))) {
				antinodes.push(antinodeA);
			}
			if (!antinodes.some(antinode => antinode.isEqual(antinodeB))) {
				antinodes.push(antinodeB);
			}
		}
	}
}
const total = antinodes.filter(antinode => antinode.isInBounds());
console.info('Part 1:', total.length);

// Part 2.
const antinodes2 = [];
for (const [frequency, towers] of frequencies.entries()) {
	const visited = [];
	for (const towerA of towers) {
		visited.push(towerA);
		for (const towerB of towers) {
			if (towerA === towerB) continue;
			if (visited.includes(towerB)) continue;
			if (!antinodes2.some(antinode => antinode.isEqual(towerA))) {
				antinodes2.push(towerA);
			}
			if (!antinodes2.some(antinode => antinode.isEqual(towerB))) {
				antinodes2.push(towerB);
			}
			const dx = towerA.x - towerB.x;
			const dy = towerA.y - towerB.y;
			const maxX = Math.max(towerA.x, towerB.x);
			const minX = Math.min(towerA.x, towerB.x);
			// const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			const gradient = dy / dx;
			// y = mx + c
			// c = y - mx
			const c = towerA.y - gradient * towerA.x;
			let antinodeA;
			let i = 1;
			while (!antinodeA || antinodeA.isInBounds()) {
				const xA = maxX + Math.abs(dx) * i;
				antinodeA = new Vector(Math.round(xA), Math.round(gradient * xA + c));
				if (!antinodes2.some(antinode => antinode.isEqual(antinodeA))) {
					antinodes2.push(antinodeA);
				}
				i++;
			}
			let antinodeB;
			i = 1;
			while (!antinodeB || antinodeB.isInBounds()) {
				const xB = minX - Math.abs(dx) * i;
				antinodeB = new Vector(Math.round(xB), Math.round(gradient * xB + c));
				if (!antinodes2.some(antinode => antinode.isEqual(antinodeB))) {
					antinodes2.push(antinodeB);
				}
				i++;
			}
			
			if (!antinodes2.some(antinode => antinode.isEqual(antinodeB))) {
				antinodes2.push(antinodeB);
			}
		}
	}
}
const total2 = antinodes2.filter(antinode => antinode.isInBounds());
console.info('Part 2:', total2.length);
