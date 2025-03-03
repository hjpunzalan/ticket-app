import { Ticket } from "../ticket";

test("implements optimistic concurrency control", async (done) => {
	// Create an instance of a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 5,
		userId: "123",
	});

	// Save the ticket to the database'
	await ticket.save();

	// Fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// Make two separate changes to the tickets we fetched
	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });

	// save the first fetched ticket
	await firstInstance!.save();

	// save the second fetched ticket (outdated version number) and expect an error
	try {
		await secondInstance!.save();
	} catch (error) {
		return done();
	}

	throw new Error("Should not reach this point");
});

test("increments the version number on multiple saves", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		userId: "123",
	});

	await ticket.save();
	expect(ticket.version).toEqual(0);
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
