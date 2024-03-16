import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import userRouter from "./routes/user";
import alertRouter from "./routes/alert";

const PORT: number = 3000;

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);

app.use("/user", userRouter);
app.use("/alert", alertRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
