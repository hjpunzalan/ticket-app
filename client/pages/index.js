import axios from "axios";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <div>Landing Page</div>;
};

// Making request from server
LandingPage.getInitialProps = async ({ req }) => {
	let baseUrl = "";
	console.log(`${req["x-forwarded-proto"]}://${req.headers.host}`);

	if (typeof window === "undefined") {
		// x-forwarded-proto set by nginx, IP address for headers.host mapped in pod config
		baseUrl = `${req["x-forwarded-proto"]}://${req.headers.host}`;
	}
	const { data } = await axios.get(`${baseUrl}/api/users/currentuser`);
	return data;
};

export default LandingPage;
