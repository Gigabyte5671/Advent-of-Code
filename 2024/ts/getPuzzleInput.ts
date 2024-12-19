import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { session } from './session.ts';

export async function getPuzzleInput (day: number, test: boolean): Promise<string> {
	const path = `../inputs/day${day.toString().padStart(2, '0')}-${test ? 'test' : 'input'}.txt`;
	if (test) {
		return readFileSync(path, { encoding: 'utf-8' }).replaceAll('\r', '').trim();
	}
	if (existsSync(path)) {
		return readFileSync(path, { encoding: 'utf-8' }).replaceAll('\r', '').trim();
	}
	const headers = { cookie: session };
	const url = `https://adventofcode.com/2024/day/${day}/input`;
	const result = await fetch(url, { headers });
	const text = await result.text();
	writeFileSync(path, text, { encoding: 'utf-8' });
	return text.trim();
}
