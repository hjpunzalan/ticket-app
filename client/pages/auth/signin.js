import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/users/signin",
		method: "post",
		body: { email, password },
		onSuccess: () => Router.push("/"),
	});

	const onSubmit = (e) => {
		e.preventDefault();
		doRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign in</h1>
			<div className="form-group">
				<label>Email address</label>
				<input
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="form-control"
				/>
			</div>
			{errors}
			<button className="btn btn-primary">Sign in</button>
		</form>
	);
};
