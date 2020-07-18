import axios from "axios";

/* Dont use hooks outside of react components */
const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <div>Landing Page</div>;
};

// Making request from server
LandingPage.getInitialProps = async () => {
	const response = await axios.get(
		"http://ingress-nginx-controller-admission.kube-system.svc.cluster.local/api/users/currentuser"
	);

	return response.data;
};

export default LandingPage;
