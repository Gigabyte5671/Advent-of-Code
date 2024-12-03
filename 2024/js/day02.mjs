import { getPuzzleInput } from './getPuzzleInput.mjs';

const lines = (await getPuzzleInput(2)).split('\n');
lines.pop();
const reports = lines.map(line => line.split(' ').map(Number));
let safeReports = 0;

// Part 1.
function reportIsSafe (report) {
	const direction = Math.sign(Math.sign(report[0] - report[1]) + Math.sign(report[1] - report[2]) + Math.sign(report[2] - report[3]));
	let safe = true;
	for (let i = 0; i < report.length - 1; i++) {
		const level = report[i];
		const nextLevel = report[i + 1];
		const difference = level - nextLevel;
		const sign = Math.sign(difference);
		if (sign !== direction || Math.abs(difference) < 1 || Math.abs(difference) > 3) {
			safe = false;
			break;
		}
	}
	return safe;
}
for (const report of reports) {
	const safe = reportIsSafe(report);
	if (safe) safeReports++;
}
console.info('Part 1:', safeReports);

// Part 2.
safeReports = 0;
for (const report of reports) {
	const variations = [];
	for (let i = 0; i < report.length; i++) {
		const variation = [...report];
		variation.splice(i, 1);
		variations.push(variation);
	}
	const safe = variations.some(reportIsSafe);
	if (safe) safeReports++;
}
console.info('Part 2:', safeReports);
