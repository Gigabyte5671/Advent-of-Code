import { readFileSync } from 'fs';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).split("\n");
let totalSum = 0;

for (const thing of input) {
	const line = thing.split(" ");
	const history = [[]];
	let sum = 0;
	let index = 0;
	for (const num of line) {
		history[0].push(parseInt(num));
	}
	
	do {
		sum = 0;
		history.push([]);
		for (let i = 0; i < history[index].length - 1; i++) {
			const diff = Math.abs(history[index][i] - history[index][i + 1]);
			sum += diff;
			history[index + 1].push(diff);
		}
		index++;
	} while(sum !== 0);
	
	history[index].push(0);
	
	for (const num of history) {
		if (index - 1 < 0) {
			break;
		}
		let currentNum = history[index].at(-1);
		let previousNum = history[index - 1].at(-1);
		if (previousNum < 0) {
			history[index - 1].push(previousNum - currentNum);
		} else {
			history[index - 1].push(currentNum + previousNum);
		}
		
		index--;
	}
	
	console.log(history);
	totalSum += history[0].at(-1);
}

console.log(totalSum);
