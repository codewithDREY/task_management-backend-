const { initDB } = require("../../config/db")

export enum Status {
    Pending = "Pending",
    In_Progress = "In Progress",
    Completed = "Completed"
}; 

export interface taskValue {
    task_id?: number,
    task_description: string,
    status?: Status;
    priority: string;
    notes: string;
    due_date: string;
    assigned_to: string;
};


// creating task models
const taskDetails = async (result: taskValue) => {
    const db = await initDB();

    const exist = await existTask(result.task_description);

    if (exist) {
        throw new Error("Task already Exist")
    }

    const query = `INSERT INTO task_todo (task_description, status, priority, notes, due_date, assigned_to)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;
    `;
    const values = [
        result.task_description,
        result.status,
        result.priority,
        result.notes,
        result.due_date,
        result.assigned_to
    ];
    try {
        const results = await db?.query(query, values);
        return results.rows[0];
    } catch (err) {
        console.error("Error", err);
        throw err;
    } finally {
        await db?.end();
    }
};

const existTask = async (task_description: string) => {
    const db = await initDB();

    const query = `SELECT * FROM task_todo WHERE task_description = $1 LIMIT 1`;
    const value = [task_description];

    try {
        const result = await db?.query(query, value);
        return result.rows[0];
    } catch (err) {
        console.error("Error checking if task exists:", err);
        throw err;
    } finally {
        await db?.end();
    }
};

// read models
const retrievedTask = async () => {
    const db = await initDB();

    const query = `SELECT * FROM task_todo`;
    try {
        const result = await db?.query(query);
        return result.rows;
    } catch (err) {
        console.error("Error", `${err}`);
        throw err;
    } finally {
        await db?.end();
    }
};


// read models by status
const retrieve_task_status = async (status: Status) => {
    const db = await initDB();

    const query = `SELECT * FROM task_todo WHERE status= $1`;
    const value = [status];

    try {
        const result = await db?.query(query, value);
        return result?.rows;
    } catch (error) {
        throw error;
    }
};

// taskUpdate models
const taskUpdated = async (update: { task_id: number, status: string }) => {
    const db = await initDB();

    const query = `UPDATE task_todo SET status = $1 WHERE task_id = $2`;
    const values = [
        update.status,
        update.task_id
    ];

    try {
        const result = await db?.query(query, values);
        return result;
    } catch (err) {
        console.error("Error", `${err}`);
        throw err;
    } finally {
        await db?.end();
    }
};


// deleting task models
const taskToDelete = async (task_id: number) => {
    const db = await initDB();

    const query = `DELETE FROM task_todo WHERE task_id = $1`;
    const values = [task_id];
    try {
        const result = await db?.query(query, values);
        return result;
    } catch (err) {
        console.error("Error", `${err}`);
        throw err;
    } finally {
        await db?.end();
    }
};

export default {
    taskDetails,
    existTask,
    retrievedTask,
    retrieve_task_status,
    taskUpdated,
    taskToDelete
};