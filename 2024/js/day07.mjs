import { getPuzzleInput } from './getPuzzleInput.mjs';

const input = (await getPuzzleInput(7)).trim().split('\n');

class Equation {
	result;
	parameters = [];

	constructor (equation) {
		const pattern = /(?<result>\d+):(?<parameters>.*)/i;
		const thing = pattern.exec(equation);
		this.result = Number(thing.groups.result);
		this.parameters = thing.groups.parameters.trim().split(' ').map(Number);
	}
}

// Part 1.
const operators = ['+', '*'];
const equations = input.map(equation => new Equation(equation));
let total = 0;
for (const equation of equations) {
	const spaces = equation.parameters.length - 1;
	const configurations = spaces === 1 ? 2 : Math.pow(operators.length, spaces);
	for (let configuration = 0; configuration <= configurations; configuration++) {
		const o = [];
		let q = 1;
		for (let space = 0; space < spaces; space++) {
			o.push(operators[Math.min(configuration & q, 1)]);
			q *= 2;
		}
		const result = equation.parameters.reduce((a, parameter, index) => {
			const operator = o[index - 1];
			return operator === '+' ? a + parameter : a * parameter;
		});
		if (result === equation.result) {
			total += result;
			break;
		}
	}
}
console.info('Part 1:', total);

// Part 2.
const operators2 = ['+', '*', '||'];
total = 0;
for (const equation of equations) {
	const spaces = equation.parameters.length - 1;
	const configurations = spaces === 1 ? 3 : Math.pow(operators2.length, spaces);
	for (let configuration = 0; configuration < configurations; configuration++) {
		const o = configuration
			.toString(3)
			.padStart(spaces, '0')
			.split('')
			.map(digit => operators2[Number(digit)]);
		const result = equation.parameters.reduce((a, parameter, index) => {
			const operator = o[index - 1];
			if (operator === '+') return a + parameter;
			if (operator === '*') return a * parameter;
			if (operator === '||') return Number(String(a) + String(parameter));
		});
		if (result === equation.result) {
			total += result;
			break;
		}
	}
}
console.info('Part 2:', total);
