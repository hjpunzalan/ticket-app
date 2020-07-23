import Link from "next/link";
export default ({ currentUser }) => {
	console.log(currentUser);
	return (
		<nav className="navbar navbar-light bg-light">
			<Link href="/">
				<a className="navbar-brand">TicketApp</a>
			</Link>
			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">
					{currentUser ? "Sign out" : "Sign in"}
				</ul>
			</div>
		</nav>
	);
};
