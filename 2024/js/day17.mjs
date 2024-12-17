import { getPuzzleInput } from './getPuzzleInput.mjs';

const input = (await getPuzzleInput(17, false)).split('\n\n');
const registers = Array.from(input[0].matchAll(/Register [ABC]: ([0-9]+)/g));
const instructions = /Program: ([0-9,]*)/g.exec(input[1])?.[1]?.split(',').map(Number);

class Computer {
	instructions = [];
	output = [];
	pointer = 0;
	register = {
		a: 0,
		b: 0,
		c: 0
	};

	constructor (a, b, c, instructions) {
		this.instructions = instructions;
		this.register.a = a;
		this.register.b = b;
		this.register.c = c;
	}

	adv (operand) {
		const numerator = this.register.a;
		const denominator = Math.pow(2, this.combo(operand));
		this.register.a = Math.trunc(numerator / denominator);
	}

	bxl (operand) {
		this.register.b = operand ^ this.register.b;
	}

	bst (operand) {
		this.register.b = this.combo(operand) % 8;
	}

	jnz (operand) {
		if (!this.register.a) {
			this.pointer += 2;
			return;
		}
		this.pointer = operand;
	}

	bxc (operand) {
		this.register.b = this.register.b ^ this.register.c;
	}

	out (operand) {
		this.output.push(this.combo(operand) % 8);
	}

	bdv (operand) {
		const numerator = this.register.a;
		const denominator = Math.pow(2, this.combo(operand));
		this.register.b = Math.trunc(numerator / denominator);
	}

	cdv (operand) {
		const numerator = this.register.a;
		const denominator = Math.pow(2, this.combo(operand));
		this.register.c = Math.trunc(numerator / denominator);
	}

	combo (operand) {
		switch (operand) {
			case 0:
			case 1:
			case 2:
			case 3:
				return operand;
			case 4:
				return this.register.a;
			case 5:
				return this.register.b;
			case 6:
				return this.register.c;
		}
	}

	readInstruction () {
		const instruction = {
			opcode: this.instructions[this.pointer],
			operand: this.instructions[this.pointer + 1]
		};
		this.pointer += instruction.opcode === 3 ? 0 : 2;
		return instruction;
	}

	processInstruction (opcode, operand) {
		switch (opcode) {
			case 0:
				this.adv(operand);
				break;
			case 1:
				this.bxl(operand);
				break;
			case 2:
				this.bst(operand);
				break;
			case 3:
				this.jnz(operand);
				break;
			case 4:
				this.bxc(operand);
				break;
			case 5:
				this.out(operand);
				break;
			case 6:
				this.bdv(operand);
				break;
			case 7:
				this.cdv(operand);
				break;
		}
	}

	run () {
		while (this.pointer < this.instructions.length) {
			const { opcode, operand } = this.readInstruction();
			this.processInstruction(opcode, operand);
		}
		return this.output;
	}
}

// Part 1.
function part1 () {
	const computer = new Computer(
		Number(registers[0][1]),
		Number(registers[1][1]),
		Number(registers[2][1]),
		instructions
	);
	const output = computer.run().join(',');
	console.info('Part 1:', output);
}
part1();

// Part 2.
function optimisedComputer (A = 0) {
	const output = [];
	let a = A;
	let b = 0;
	let c = 0;
	let o = 0;
	for (let i = 0; i < 16; i++) {
		b = a % 8;
		b = b ^ 6;
		c = Math.trunc(a / Math.pow(2, b));
		b = b ^ c;
		b = b ^ 7;
		a = Math.trunc(a / 8);
		o = b % 8;
		if (o < 0) break;
		output.push(o);
		if (a === 0) break;
	}
	return output;
}

function part2 () {
	console.info('Part 2:');
}
part2();
