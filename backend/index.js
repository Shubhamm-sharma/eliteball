const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const connection = require("./dbConnection/connection");
const socketManager = require("./Services/SocketService");

const app = express();
const server = http.createServer(app); // wrap express in http server
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require("cors")());

connection(process.env.MONGO_URI);
socketManager.init(server); // attach Socket.IO to http server

// Routes
app.use("/api/admin", require("./Routes/adminAuth"));
app.use("/api/matches", require("./Routes/matchRoute"));
app.use("/api/teams", require("./Routes/teamRoute"));
app.use("/api/matches/:id/events", require("./Routes/adminEvents"));

server.listen(port, () => console.log(`Server running on port ${port}`));
