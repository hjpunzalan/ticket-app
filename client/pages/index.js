import axios from "axios";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <div>Landing Page</div>;
};

// Making request from server unless navigating between pages within the app
LandingPage.getInitialProps = async ({ req }) => {
	let baseUrl = "";
	if (typeof window === "undefined") {
		// x-forwarded-proto set by nginx, IP address for headers.host mapped in pod config
		// replace http with ${req.headers["x-forwarded-proto"]}
		baseUrl = `http://${req.headers.host}`;
	}
	const { data } = await axios.get(`${baseUrl}/api/users/currentuser`);
	return data;
};

export default LandingPage;
