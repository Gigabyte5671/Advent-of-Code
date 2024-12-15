import { getPuzzleInput } from './getPuzzleInput.mjs';

let garden = (await getPuzzleInput(12, false)).split('\n').map(row => row.split(''));
let width = garden[0].length;
let height = garden.length;

function calculatePerimeter (garden, plant) {
	const perimiters = [
		garden[plant.y - 1]?.[plant.x],
		garden[plant.y]?.[plant.x + 1],
		garden[plant.y + 1]?.[plant.x],
		garden[plant.y]?.[plant.x - 1]
	];
	return perimiters.filter(p => String(p) !== plant.type)?.length || 0;
}

function getNeighbors (garden, plant, accumulator = [plant]) {
	const neighbors = [
		new Plant(garden[plant.y - 1]?.[plant.x], plant.x, plant.y - 1),
		new Plant(garden[plant.y]?.[plant.x + 1], plant.x + 1, plant.y),
		new Plant(garden[plant.y + 1]?.[plant.x], plant.x, plant.y + 1),
		new Plant(garden[plant.y]?.[plant.x - 1], plant.x - 1, plant.y)
	];
	const valid = neighbors
		.filter(p => p.type === plant.type)
		.filter(p => !accumulator.some(s => isAtSamePoint(p, s)));
	accumulator.push(...valid);
	valid.forEach(neighbor => getNeighbors(garden, neighbor, accumulator));
	return accumulator;
}

function isAtSamePoint (plantA, plantB) {
	return plantA.x === plantB.x && plantA.y === plantB.y;
}

class Plant {
	type;
	x;
	y;
	perimeter = 0;

	constructor (type, x, y) {
		this.type = type ?? '#';
		this.x = x;
		this.y = y;
		this.perimeter = calculatePerimeter(garden, this);
	}

	toString () {
		return this.type;
	}
}

// Part 1.
function part1 () {
	const plots = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			const plant = new Plant(garden[r][c], c, r);
			const exists = plots.some(a => a.some(p => isAtSamePoint(p, plant)));
			if (exists) continue;
			const neighbors = getNeighbors(garden, plant);
			plots.push(neighbors);
		}
	}
	const prices = [];
	for (const plot of plots) {
		const area = plot.length;
		const perimeter = plot.reduce((a, b) => a + b.perimeter, 0);
		prices.push(area * perimeter);
	}
	return prices.reduce((a, b) => a + b, 0);
}
console.info('Part 1:', part1());

// Part 2.
class Edge {
	direction;
	x;
	y;
	plants = [];
	
	constructor (plants) {
		this.plants = plants;
		this.x = (plants[0].x + plants[1].x) / 2;
		this.y = (plants[0].y + plants[1].y) / 2;
		this.direction = this.x.toString().includes('.') ? 'vertical' : 'horizontal';
		this.plants.sort((a, b) => {
			if (this.direction === 'horizontal') return a.y - b.y;
			return a.x - b.x;
		});
	}
}

function getEdges (garden, plot) {
	const edges = [];
	for (let i = 0; i < plot.length; i++) {
		const plant = plot[i];
		const neighbors = [
			new Plant(garden[plant.y - 1]?.[plant.x], plant.x, plant.y - 1),
			new Plant(garden[plant.y]?.[plant.x + 1], plant.x + 1, plant.y),
			new Plant(garden[plant.y + 1]?.[plant.x], plant.x, plant.y + 1),
			new Plant(garden[plant.y]?.[plant.x - 1], plant.x - 1, plant.y)
		];
		const others = neighbors.filter(p => p.type !== plant.type);
		for (const other of others) {
			edges.push(new Edge([plant, other]));
		}
	}
	return edges;
}

function countSides (type, edges, direction) {
	const index = direction === 'horizontal' ? 'y' : 'x';
	const opposing = direction === 'horizontal' ? 'x' : 'y';
	let sides = 0;
	const groups = new Map();
	for (const edge of edges.filter(edge => edge.direction === direction)) {
		const y = edge[index];
		if (!groups.has(y)) groups.set(y, []);
		const group = groups.get(y);
		group.push(edge);
	}
	for (const group of groups.values()) {
		group.sort((a, b) => a[opposing] - b[opposing]);
		let previousEdge = {};
		for (const edge of group) {
			const gap = edge[opposing] - previousEdge[opposing] !== 1;
			const flipped = edge.plants.findIndex(plant => plant.type === type) !== previousEdge.plants?.findIndex(plant => plant.type === type);
			if (gap || flipped) {
				sides++;
			}
			previousEdge = edge;
		}
	}
	return sides;
}

function part2 () {
	const plots = [];
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			const plant = new Plant(garden[r][c], c, r);
			const exists = plots.some(a => a.some(p => isAtSamePoint(p, plant)));
			if (exists) continue;
			const neighbors = getNeighbors(garden, plant);
			plots.push(neighbors);
		}
	}
	const prices = [];
	for (const plot of plots) {
		const area = plot.length;
		const edges = getEdges(garden, plot);
		const type = plot[0].type;
		const horizontalSides = countSides(type, edges, 'horizontal');
		const verticalSides = countSides(type, edges, 'vertical');
		const sides = horizontalSides + verticalSides;
		prices.push(area * sides);
	}
	return prices.reduce((a, b) => a + b, 0);
}
console.info('Part 2:', part2());



// Tests.
function test () {
	console.log('Tests:');
	const results = ['❌', '✅'];
	garden = `AAAA\nBBCD\nBBCC\nEEEC`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test1A = part1();
	console.log('  Part 1:', '140'.padEnd(4, ' '), '-', results[Number(test1A === 140)], test1A);
	const test1B = part2();
	console.log('  Part 2:', '80'.padEnd(4, ' '), '-', results[Number(test1B === 80)], test1B);

	garden = `OOOOO\nOXOXO\nOOOOO\nOXOXO\nOOOOO`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test2A = part1();
	console.log('  Part 1:', '772'.padEnd(4, ' '), '-', results[Number(test2A === 772)], test2A);
	const test2B = part2();
	console.log('  Part 2:', '436'.padEnd(4, ' '), '-', results[Number(test2B === 436)], test2B);

	garden = `EEEEE\nEXXXX\nEEEEE\nEXXXX\nEEEEE`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test3A = part1();
	console.log('  Part 1:', '692'.padEnd(4, ' '), '-', results[Number(test3A === 692)], test3A);
	const test3B = part2();
	console.log('  Part 2:', '236'.padEnd(4, ' '), '-', results[Number(test3B === 236)], test3B);

	garden = `AAAAAA\nAAABBA\nAAABBA\nABBAAA\nABBAAA\nAAAAAA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test4A = part1();
	console.log('  Part 1:', '1184'.padEnd(4, ' '), '-', results[Number(test4A === 1184)], test4A);
	const test4B = part2();
	console.log('  Part 2:', '368'.padEnd(4, ' '), '-', results[Number(test4B === 368)], test4B);

	garden = `RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test5A = part1();
	console.log('  Part 1:', '1930'.padEnd(4, ' '), '-', results[Number(test5A === 1930)], test5A);
	const test5B = part2();
	console.log('  Part 2:', '1206'.padEnd(4, ' '), '-', results[Number(test5B === 1206)], test5B);

	garden = `AB\nBA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test6A = part1();
	console.log('  Part 1:', '16'.padEnd(4, ' '), '-', results[Number(test6A === 16)], test6A);
	const test6B = part2();
	console.log('  Part 2:', '16'.padEnd(4, ' '), '-', results[Number(test6B === 16)], test6B);

	garden = `ABB\nABB\nBBB\nBAB`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test7A = part1();
	console.log('  Part 1:', '160'.padEnd(4, ' '), '-', results[Number(test7A === 160)], test7A);
	const test7B = part2();
	console.log('  Part 2:', '102'.padEnd(4, ' '), '-', results[Number(test7B === 102)], test7B);

	garden = `ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test8A = part1();
	console.log('  Part 1:', '2520'.padEnd(4, ' '), '-', results[Number(test8A === 2520)], test8A);
	const test8B = part2();
	console.log('  Part 2:', '140'.padEnd(4, ' '), '-', results[Number(test8B === 140)], test8B);

	garden = `ZZZZZZZZZZZZZZZZZAZZZZZZZZZZZZZZZZZ`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test9A = part1();
	console.log('  Part 1:', '1228'.padEnd(4, ' '), '-', results[Number(test9A === 1228)], test9A);
	const test9B = part2();
	console.log('  Part 2:', '140'.padEnd(4, ' '), '-', results[Number(test9B === 140)], test9B);

	garden = `Z\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nA\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ\nZ`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test10A = part1();
	console.log('  Part 1:', '1228'.padEnd(4, ' '), '-', results[Number(test10A === 1228)], test10A);
	const test10B = part2();
	console.log('  Part 2:', '140'.padEnd(4, ' '), '-', results[Number(test10B === 140)], test10B);

	garden = `AAAAAAA\nAAABAAA\nABBBBBA\nABBBBBA\nAAABAAA\nABBBBAA\nAAAABAA\nAAAABAA\nABBBBBA\nAAAAAAA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test11B = part2();
	console.log('  Part 2:', '1728'.padEnd(4, ' '), '-', results[Number(test11B === 1728)], test11B);

	garden = `AAAAA\nABBBA\nABCBA\nABBBA\nAAAAA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test12B = part2();
	console.log('  Part 2:', '196'.padEnd(4, ' '), '-', results[Number(test12B === 196)], test12B);

	garden = `AAAAA\nABBBA\nAACBA\nABBBA\nAAAAA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test13B = part2();
	console.log('  Part 2:', '264'.padEnd(4, ' '), '-', results[Number(test13B === 264)], test13B);

	garden = `AAAALA\nAAALLW\nAAALWW\nTOALWA\nTTCLTA\nATCLTA\nATTTTA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test14B = part2();
	console.log('  Part 2:', '336'.padEnd(4, ' '), '-', results[Number(test14B === 336)], test14B);

	garden = `AAAAAA\nABXLFA\nAAAAAA\nFFFFFA\nFAAAAA\nAFFFFA\nAAAAAA`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test15B = part2();
	console.log('  Part 2:', '572'.padEnd(4, ' '), '-', results[Number(test15B === 572)], test15B);

	garden = `VVHV\nVOVV\nVVVV`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test16B = part2();
	console.log('  Part 2:', '128'.padEnd(4, ' '), '-', results[Number(test16B === 128)], test16B);

	garden = `VVX\nVOV\nVVV`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test17B = part2();
	console.log('  Part 2:', '78'.padEnd(4, ' '), '-', results[Number(test17B === 78)], test17B);

	garden = `VVH\nVOV`.split('\n').map(row => row.split(''));
	width = garden[0].length;
	height = garden.length;
	const test18B = part2();
	console.log('  Part 2:', '30'.padEnd(4, ' '), '-', results[Number(test18B === 30)], test18B);
}
test();
