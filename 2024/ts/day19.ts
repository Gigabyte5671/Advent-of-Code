import { getPuzzleInput } from './getPuzzleInput.ts';

const input = (await getPuzzleInput(19, false)).split('\n\n');
const towels = input[0].trim().split(', ');
const designs = input[1].trim().split('\n');

function logProgress (progress: number, total: number, design: string, valid: boolean): void {
	console.info(`${((progress / total) * 100).toFixed(2)}%`.padEnd(8, ' '), design.padEnd(70, ' '), valid);
}

function spawnWorker (design: string, towels: string[]): Worker {
	const url = new URL('./day19.worker.ts', import.meta.url).href;
	const worker = new Worker(url, { type: 'module' });
	worker.postMessage({ design, towels });
	return worker;
}

// Part 1.
export async function part1 (): Promise<void> {
	const validDesigns = new Array<boolean>();
	const queueLimit = 20;
	const queue = new Array<Array<string>>();
	for (const design of designs.sort((a, b) => a.length - b.length)) {
		const batch = queue.at(-1);
		if (batch && batch.length < queueLimit) {
			batch.push(design);
		} else {
			queue.push([ design ]);
		}
	}
	for (const batch of queue) {
		console.info('New batch:');
		const operations = new Array<Promise<boolean>>();
		for (const design of batch) {
			operations.push(new Promise(resolve => {
				const worker = spawnWorker(design, towels);
				worker.onmessage = (message) => {
					validDesigns.push(message.data);
					logProgress(validDesigns.length, designs.length, design, message.data);
					resolve(message.data);
				};
			}));
		}
		await Promise.all(operations);
	}
	console.info('\nPart 1:', validDesigns.filter(Boolean).length);
}
part1();
