import express from "express";
import { getDoc, setDoc, doc } from "firebase/firestore";

import { db } from "../db/config";

const router = express.Router();

type User = {
	user_id: number;
	ip_address: string;
	long: number;
	lat: number;
	city: string;
	state: string;
};

router.post("/", async (req, res) => {
	const { user_id, ip_address, long, lat, city, state }: User = req.body;
	try {
		const userRef = doc(db, "users", String(user_id));

		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) {
			await setDoc(userRef, {
				user_id,
				ip_address,
				long,
				lat,
				city,
				state,
			});
			res.status(200).send("User data updated successfully");
		} else {
			await setDoc(userRef, {
				user_id,
				ip_address,
				long,
				lat,
				city,
				state,
			});
			res.status(200).send("User data added successfully");
		}
	} catch (error) {
		console.error("Error adding document: ", error);
		res.status(500).json({ message: "Error sending alert" });
	}
});

export default router;
