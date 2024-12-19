const worker = self as unknown as Worker;
worker.onmessage = message => {
	const { design, towels } = message.data as { design: string, towels: string[] };
	const validTowels = towels.filter(towel => design.includes(towel));
	const pattern = new RegExp(`^(${validTowels.join('|')})+$`);
	const result = pattern.test(design);
	worker.postMessage(result);
	self.close();
};
