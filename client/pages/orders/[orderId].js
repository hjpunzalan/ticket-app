import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";
const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: {
			orderId: order.id,
		},
		onSuccess: () => Router.push("/orders"),
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};
		// Invoke find time left immediately and then 1 sec intervals
		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		// Clear interval only when navigating away from component or altering insde dependency array
		return () => {
			clearInterval(timerId);
		};
	}, []);

	return timeLeft < 0 ? (
		<div>Order Expired</div>
	) : (
		<div>
			Time left to pay:{timeLeft} seconds
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51HScnPH8B0q8V7WyM5dO9Z9VZ5FkBI6pKpNUjnwKMisT1HIbzlYOtNFDsL9YUJ6xfPCvTswdpUE9WJeEchDKaS6100aEiMutCB"
				amount={order.ticket.price * 100} /* cents to dollars*/
				email={currentUser.email}
			/>
			{errors}
		</div>
	);
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderShow;
