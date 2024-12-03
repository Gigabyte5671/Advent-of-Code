import { getPuzzleInput } from './getPuzzleInput.mjs';

// Part 1.
const lines = (await getPuzzleInput(1)).split('\n').map(line => line.replace(/\s+/, ' '));
lines.pop();
const column1 = lines.map(line => line.split(' ')[0]).map(Number).sort();
const column2 = lines.map(line => line.split(' ')[1]).map(Number).sort();
const distances = column1.map((value, i) => Math.abs(value - column2[i]));
const totalDistance = distances.reduce((a, b) => a + b, 0);
console.info('Part 1:', totalDistance);

// Part 2.
const similarityScores = new Map();
column1.forEach(value => similarityScores.set(value, 0));
for (const value of column1) {
	const count = column2.reduce((a, b) => a + Number(b === value), 0);
	const score = similarityScores.get(value);
	similarityScores.set(value, score + value * count);
}
const totalScore = Array.from(similarityScores).map(value => value[1]).reduce((a, b) => a + b, 0);
console.info('Part 2:', totalScore);
