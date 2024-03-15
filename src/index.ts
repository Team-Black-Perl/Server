import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import userRouter from "./routes/user";
import alertRouter from "./routes/alert";

const PORT: number = 3000;

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/alert", alertRouter);
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST"],
	})
);

io.on("connection", (socket) => {
	console.log(socket.id); // x8WIv7-mJelg7on_ALbx
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
