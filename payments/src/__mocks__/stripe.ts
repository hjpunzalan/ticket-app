// mock an async function that resolves itself

export const stripe = {
	charges: {
		create: jest.fn().mockResolvedValue({}),
	},
};
