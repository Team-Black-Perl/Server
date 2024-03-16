import express from "express";
import multer from "multer";
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

import app from "../configs/firebase";
import { Alerts, db } from "../db/config";

const storage = getStorage(app);

const router = express.Router();

type Alert = {
	uid: string;
	user_id: string;
	staus: boolean;
	lat: number;
	long: number;
	createdAt: string;
	downloadURL: string;
};

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
	try {
		const { user_id, lat, long }: Alert = req.body;
		// Check if the file is available
		if (!req.file) {
			return res.status(400).send("No file uploaded");
		}
		const storageRef = ref(storage, `files/${req.file?.originalname}`);

		const metadata = {
			contentType: "video/mp4",
		};

		// Upload the file in the bucket storage
		const snapshot = await uploadBytesResumable(
			storageRef,
			req.file?.buffer as ArrayBuffer,
			metadata
		);
		// Grab the public url
		const downloadURL = await getDownloadURL(snapshot.ref);

		await addDoc(Alerts, {
			user_id,
			lat,
			long,
			status: false,
			downloadURL,
			createdAt: new Date().toISOString(),
		});

		console.log("File successfully uploaded.");
		return res.send({
			message: "file uploaded to firebase storage",
			name: req.file?.originalname,
			type: req.file?.mimetype,
			downloadURL: downloadURL,
		});
	} catch (error) {
		return res.status(400).send((error as Error).message);
	}
});

router.get("/All", async (req, res) => {
	try {
		const alerts: Alert[] = [];
		const querySnapshot = await getDocs(Alerts);
		querySnapshot.forEach((doc) => {
			alerts.push({ uid: doc.id, ...doc.data() } as Alert);
		});
		const id: string = alerts[0].user_id;


		const user = collection(db, "users");
		const userSnapshot = await getDoc(doc(user, id));

		const userData = userSnapshot.data();
		return res.status(200).json({ alerts, userData });
	} catch (error) {
		return res.status(500).json({ message: "Error getting alerts" });
	}
});

router.get("/incomplete", async (req, res) => {
	try {
		const q = query(collection(db, "alerts"), where("status", "==", false));
		const alerts: Alert[] = [];

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			alerts.push({ uid: doc.id, ...doc.data() } as Alert);
		});
		const id: string = alerts[0].user_id;

		const user = collection(db, "users");
		const userSnapshot = await getDoc(doc(user, id));

		const userData = userSnapshot.data();
		return res.status(200).json({ alerts, userData });
	} catch (error) {
		return res.status(500).json({ message: "Error getting alerts" });
	}
});

router.post("/update", async (req, res) => {
	try {
		const { uid } = req.body;
		
		const alertsRef = doc(db, "alerts", uid);
		await updateDoc(alertsRef, { status: true });
		return res.status(200).json({ message: "Alert status updated" });
	} catch (error) {
		return res.status(500).json({ message: "Error updating alert" });
	}
});

export default router;
