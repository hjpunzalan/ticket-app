import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
	if (!req.session?.jwt) {
		return res.send({ currentUser: null });
	}
});

export { router as currentUserRouter };
