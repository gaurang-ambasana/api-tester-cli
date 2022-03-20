import express from "express";

const app = express();

app.use(express.static("../api-tester-cli/"));
app.get("/", (req, res) => res.sendFile("./index.html"));

app.listen(3000, () => console.log("started"));
