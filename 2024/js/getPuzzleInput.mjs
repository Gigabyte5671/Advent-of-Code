import { readFileSync } from 'node:fs';
import { session } from './session.mjs';

export async function getPuzzleInput (day, test) {
	if (test) {
		const path = `../inputs/day${day.toString().padStart(2, '0')}-test.txt`
		return readFileSync(path, { encoding: 'utf-8' });
	}
	const headers = { cookie: session };
	const url = `https://adventofcode.com/2024/day/${day}/input`;
	const result = await fetch(url, { headers });
	return await result.text();
}
