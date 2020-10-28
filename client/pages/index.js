import Link from "next/link";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});

	return (
		currentUser && (
			<div>
				<h2>Tickets</h2>
				<table className="table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>{ticketList}</tbody>
				</table>
			</div>
		)
	);
};

// Making request from server unless navigating between pages within the app
LandingPage.getInitialProps = async (context, client, currentUser) => {
	// const client = buildClient(context);
	// const { data } = await client.get("/api/users/currentuser");
	// return data;
	const { data } = await client.get("/api/tickets");
	return { tickets: data };
};

export default LandingPage;
