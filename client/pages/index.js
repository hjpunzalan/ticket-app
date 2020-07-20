import buildClient from "../api/buildClient";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are NOT signed in</h1>
	);
};

// Making request from server unless navigating between pages within the app
LandingPage.getInitialProps = async (context) => {
	const client = buildClient(context);
	const { data } = await client.get("/api/users/currentuser");
	return data;
};

export default LandingPage;
