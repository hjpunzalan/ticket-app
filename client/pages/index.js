import buildClient from "../api/buildClient";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <div>Landing Page</div>;
};

// Making request from server unless navigating between pages within the app
LandingPage.getInitialProps = async (context) => {
	const client = buildClient(context);
	const { data } = await client.get("/api/users/currentuser");
	return data;
};

export default LandingPage;
