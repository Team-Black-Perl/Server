import { getFirestore, collection } from "firebase/firestore";

import app from "../configs/firebase";

export const db = getFirestore(app);

export const Alerts = collection(db, "alerts");
