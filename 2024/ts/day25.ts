import { getPuzzleInput } from './getPuzzleInput.ts';

const input = (await getPuzzleInput(25, false)).split('\n\n');

function getPins (schematic: string): Array<string> {
	const rows = schematic.split('\n');
	const pins = new Array<string>(5).fill('');
	for (let r = 0; r < rows.length; r++) {
		const row = rows[r];
		for (let c = 0; c < row.length; c++) {
			const character = row[c];
			pins[c] += character;
		}
	}
	return pins;
}

function isLock (pins: Array<string>): boolean {
	return pins[0]?.[0] === '#';
}

function isKey (pins: Array<string>): boolean {
	return !isLock(pins);
}

function parseLock (pins: Array<string>): string {
	return pins.map(pin => pin.indexOf('.') - 1).join('-');
}

function parseKey (pins: Array<string>): string {
	return pins.map(pin => pin.split('').reverse().indexOf('.') - 1).join('-');
}

function keyFitsLock (key: string, lock: string): boolean {
	const keyPins = key.split('-').map(Number);
	const lockPins = lock.split('-').map(Number);
	return keyPins.every((pin, i) => pin + lockPins[i] <= 5);
}

// Part 1.
export function part1 (): void {
	const pinSets = input.map(getPins);
	const locks = pinSets.filter(isLock).map(parseLock);
	const keys = pinSets.filter(isKey).map(parseKey);
	const pairs = new Set<string>();
	for (const lock of locks) {
		for (const key of keys) {
			if (keyFitsLock(key, lock)) {
				pairs.add(`${lock}+${key}`);
			}
		}
	}
	console.info('Part 1:', pairs.size);
}
part1();
