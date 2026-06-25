import express from "express";
import gameApiRouter from "./router/api.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/api", gameApiRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
