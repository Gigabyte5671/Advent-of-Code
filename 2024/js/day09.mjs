import { getPuzzleInput } from './getPuzzleInput.mjs';

const filesystem = (await getPuzzleInput(9)).split('').map(Number);

function createFileMap () {
	const filemap = [];
	let fileId = 0;
	for (let i = 0; i < filesystem.length; i++) {
		const block = filesystem[i];
		const isFile = i % 2 === 0;
		if (isFile) {
			filemap.push(...new Array(block).fill(fileId));
			fileId++;
		} else {
			filemap.push(...new Array(block));
		}
	}
	return filemap;
}

function calculateChecksum (filemap) {
	let checksum = 0;
	for (let i = 0; i < filemap.length; i++) {
		const block = filemap[i];
		if (typeof block === 'undefined') continue;
		checksum += block * i;
	}
	return checksum;
}

// Part 1.
function part1 () {
	const filemap = createFileMap();
	for (let j = filemap.length - 1; j >= 0; j--) {
		const block = filemap[j];
		if (typeof block === 'undefined') continue;
		const spaceIndex = filemap.indexOf(undefined);
		if (spaceIndex > j) break;
		filemap[spaceIndex] = block;
		filemap[j] = undefined;
	}
	const checksum = calculateChecksum(filemap);
	console.info('Part 1:', checksum);
}
part1();

// Part 2.
function part2 () {
	const filemap = createFileMap();
	const ignoreList = [];
	for (let j = filemap.length - 1; j >= 0; j--) {
		const block = filemap[j];
		if (ignoreList.includes(block)) continue;
		if (typeof block !== 'number') continue;
		ignoreList.push(block);
		const blockIndex = filemap.indexOf(block);
		const blockLength = j - blockIndex + 1;
	
		let spaceFound = false;
		let spaceIndex = 0;
		let spaceStart = 0;
		while (!spaceFound) {
			spaceIndex = filemap.indexOf(undefined, spaceIndex);
			if (spaceIndex > blockIndex) break;
			spaceStart = spaceIndex;
			let thing = undefined;
			while (typeof thing === 'undefined') {
				spaceIndex++;
				thing = filemap[spaceIndex];
			}
			const spaceLength = spaceIndex - spaceStart;
			if (spaceLength >= blockLength) {
				spaceFound = true;
			}
		}
	
		if (spaceFound) {
			if (spaceStart > blockIndex) break;
			filemap.splice(spaceStart, blockLength, ...new Array(blockLength).fill(block));
			filemap.splice(blockIndex, blockLength, ...new Array(blockLength));
		}
	}
	const checksum = calculateChecksum(filemap);
	console.info('Part 2:', checksum);
}
part2();
