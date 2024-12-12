import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const initDB = async () => {
    const client = new Client ({
        user: "postgres", // process.env.PG_USER
        host: "", // process.env.PG_HOST
        database: "task_management", // process.env.PG_NAME
        password: "", // process.env.PG_PASSOWORD
        port: 5432 // process.env.PG_PORT
    });
    try {
        await client.connect();
        console.log("Database connected successfully")
        return client;
    } catch (err) {
        console.error({ message: "Database connection failed", err});
        throw new Error("Database connection failed")
    };
};