// import buildClient from "../api/buildClient";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Tickets</h1>
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
	);
};

// Making request from server unless navigating between pages within the app
LandingPage.getInitialProps = async (context, client, currentUser) => {
	// const client = buildClient(context);
	// const { data } = await client.get("/api/users/currentuser");
	// return data;
	const { data } = await client.geT("/api/tickets");
	return { tickets: data };
};

export default LandingPage;
