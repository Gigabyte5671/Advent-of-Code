import { getPuzzleInput } from './getPuzzleInput.mjs';

const lines = (await getPuzzleInput(4)).split('\n');
lines.pop();
const width = lines[0].length;
const height = lines.length;

// Part 1.
function hasNorthmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row - 1]?.[column]
		+ lines[row - 2]?.[column]
		+ lines[row - 3]?.[column];
	return string === 'XMAS';
}
function hasNorthEastmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row - 1]?.[column + 1]
		+ lines[row - 2]?.[column + 2]
		+ lines[row - 3]?.[column + 3];
	return string === 'XMAS';
}
function hasEastmas (row, column) {
	return lines[row]?.substring(column, column + 4) === 'XMAS';
}
function hasSouthEastmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row + 1]?.[column + 1]
		+ lines[row + 2]?.[column + 2]
		+ lines[row + 3]?.[column + 3];
	return string === 'XMAS';
}
function hasSouthmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row + 1]?.[column]
		+ lines[row + 2]?.[column]
		+ lines[row + 3]?.[column];
	return string === 'XMAS';
}
function hasSouthWestmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row + 1]?.[column - 1]
		+ lines[row + 2]?.[column - 2]
		+ lines[row + 3]?.[column - 3];
	return string === 'XMAS';
}
function hasWestmas (row, column) {
	return lines[row]?.substring(column, column + 4) === 'SAMX';
}
function hasNorthWestmas (row, column) {
	const string =
		lines[row]?.[column]
		+ lines[row - 1]?.[column - 1]
		+ lines[row - 2]?.[column - 2]
		+ lines[row - 3]?.[column - 3];
	return string === 'XMAS';
}

let total = 0;
for (let r = 0; r < height; r++) {
	for (let c = 0; c < width; c++) {
		total += Number(hasNorthmas(r, c));
		total += Number(hasNorthEastmas(r, c));
		total += Number(hasEastmas(r, c));
		total += Number(hasSouthEastmas(r, c));
		total += Number(hasSouthmas(r, c));
		total += Number(hasSouthWestmas(r, c));
		total += Number(hasWestmas(r, c));
		total += Number(hasNorthWestmas(r, c));
	}
}
console.info('Part 1:', total);

// Part 2.
function hasXmas1 (row, column) {
	const string =
		lines[row - 1]?.[column - 1]
		+ lines[row]?.[column]
		+ lines[row + 1]?.[column + 1]
		+ lines[row - 1]?.[column + 1]
		+ lines[row]?.[column]
		+ lines[row + 1]?.[column - 1];
	return string === 'MASMAS';
}
function hasXmas2 (row, column) {
	const string =
		lines[row - 1]?.[column - 1]
		+ lines[row]?.[column]
		+ lines[row + 1]?.[column + 1]
		+ lines[row + 1]?.[column - 1]
		+ lines[row]?.[column]
		+ lines[row - 1]?.[column + 1];
	return string === 'MASMAS';
}
function hasXmas3 (row, column) {
	const string =
		lines[row + 1]?.[column + 1]
		+ lines[row]?.[column]
		+ lines[row - 1]?.[column - 1]
		+ lines[row - 1]?.[column + 1]
		+ lines[row]?.[column]
		+ lines[row + 1]?.[column - 1];
	return string === 'MASMAS';
}
function hasXmas4 (row, column) {
	const string =
		lines[row + 1]?.[column + 1]
		+ lines[row]?.[column]
		+ lines[row - 1]?.[column - 1]
		+ lines[row + 1]?.[column - 1]
		+ lines[row]?.[column]
		+ lines[row - 1]?.[column + 1];
	return string === 'MASMAS';
}

total = 0;
for (let r = 0; r < height; r++) {
	for (let c = 0; c < width; c++) {
		total += Number(hasXmas1(r, c));
		total += Number(hasXmas2(r, c));
		total += Number(hasXmas3(r, c));
		total += Number(hasXmas4(r, c));
	}
}
console.info('Part 2:', total);
