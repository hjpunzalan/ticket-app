import { useState } from "react";

const NewTicket = () => {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");

	// Clicking in and out of input event handler
	const onBlur = () => {
		const value = parseFloat(price);

		if (isNaN(value)) return;
		setPrice(value.toFixed(2));
	};

	return (
		<div>
			<h1>Create a ticket</h1>
			<form>
				<div className="form-group">
					<label>Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						onBlur={onBlur}
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className="form-control"
					/>
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default NewTicket;
