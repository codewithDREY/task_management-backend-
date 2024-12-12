import express from "express";
import cors from "cors";
import router from "./api/routes/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const port: number = 3100;

app.listen(port, (): void => {
    console.log("localhost: ", port)
});
