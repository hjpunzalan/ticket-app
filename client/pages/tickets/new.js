const newTicket = () => {
	return (
		<div>
			<h1>Create a ticket</h1>
			<form>
				<div className="form-group">
					<label className="form-control">Title</label>
					<input />
				</div>
				<div className="form-group">
					<label>Price</label>
					<input className="form-control" />
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default newTicket;
